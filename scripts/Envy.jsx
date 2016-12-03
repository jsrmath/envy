import Envy from './Envy.jsx';
import NoteBox from './NoteBox.jsx';
import Note from './Note'
import Envelope from './Envelope'
import s11 from 'sharp11';
import _ from 'underscore';
import keycode from 'keycode';
import React from 'react';
import autoBind from 'react-autobind';
import { Button } from 'react-bootstrap';

const keyBindings = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'];

const CANVAS_WIDTH = 250;
const CANVAS_HEIGHT = 250;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      noteBoxes: []
    };
    autoBind(this);
  }

  newNoteBox() {
    const nextIndex = this.state.noteBoxes.length;
    let noteBoxes = this.state.noteBoxes;
    let midiNumber;
    let noteName;

    if (nextIndex >= keyBindings.length) return;

    while (true) {
      noteName = prompt("Enter a note, e.g. A4");
      try {
        midiNumber = s11.note.create(noteName).value();
        if (midiNumber !== null) break;
      } catch (err) {}
    }

    const freq = Math.pow(2, (midiNumber - 57) / 12) * 440; // 57 should be 69, but there is a bug in sharp11

    const note = new Note(freq);
    const env = new Envelope(CANVAS_WIDTH, CANVAS_HEIGHT);

    note.setPartial(1, env);
    env.addDefaultPoints();

    noteBoxes.push({
      keyBinding: keyBindings[nextIndex],
      key: nextIndex,
      note: note,
      noteName: noteName
    });
    this.setState({noteBoxes: noteBoxes});
  }

  noteBoxes() {
    return _.map(this.state.noteBoxes, (noteBox) =>
      <NoteBox {...noteBox} canvasWidth={CANVAS_WIDTH} canvasHeight={CANVAS_HEIGHT} />
    );
  }

  boundKeys() {
    return _.pluck(this.state.noteBoxes, 'keyBinding');
  }

  keyHandler(e) {
    const noteBox = _.find(this.state.noteBoxes, (noteBox) => e.keyCode === keycode(noteBox.keyBinding));
    if (noteBox) {
      e.preventDefault();
      noteBox.note.play(this.props.ctx, 1, .5);
    }
  }

  render() {
    document.onkeydown = this.keyHandler;
    return (
      <div>
        <Button onClick={this.newNoteBox}>+</Button>
        {this.noteBoxes()}
      </div>
    );
  }
}