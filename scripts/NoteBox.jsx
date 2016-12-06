import NoteBoxCanvas from './NoteBoxCanvas.jsx';
import DurationSlider from './DurationSlider.jsx';
import _ from 'underscore';
import React from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';

export default class extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  render() {
    const classes = classNames('note-box', {'note-box-active': this.props.isActive, 'note-box-inactive': !this.props.isActive});

    return (
      <div className={classes} onClick={this.props.handleClick}>
        <div className="note-attribute note-name">{`${this.props.noteName} at ${this.props.note.freq.toFixed(2)} Hz`}</div>
        <div className="note-attribute key-name">{`Press ${this.props.keyBinding} to play`}</div>
        <DurationSlider note={this.props.note} />
        <NoteBoxCanvas {...this.props} />
      </div>
    );
  }
}