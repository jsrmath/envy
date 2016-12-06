import Envelope from './envelope';
import { numberToColor } from './color';
import _ from 'underscore';
import React from 'react';
import autoBind from 'react-autobind';
import { Button, ButtonGroup } from 'react-bootstrap';
import classNames from 'classnames';

export default class extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  editPartialButtons() {
    return _.map(this.props.note.partials, (env, num) =>
      <Button
        className={classNames('edit-partial-button', {selected: this.props.partial === Number(num)})}
        key={num}
        onClick={() => this.props.setPartial(Number(num))}
        style={{'color': numberToColor(num)}}
      >
        Edit partial {num}
      </Button>
    );
  }

  newPartial() {
    const env = new Envelope(this.props.canvasWidth, this.props.canvasHeight);
    let partial;

    while (true) {
      partial = Number(prompt("Enter a number between 1 and 10"));
      if (partial >= 1 && partial <= 10) break;
    }

    this.props.note.setPartial(partial, env);
    env.addDefaultPoints();
    this.props.setPartial(partial);
  }

  render() {
    // Awful overloading of the word partial happening here.
    // _.partial is totally unrelated to how partial is used throughout the codebase.
    return (
      <ButtonGroup>
        <Button onClick={_.partial(this.props.setPartial, null)}>View all partials</Button>
        {this.editPartialButtons()}
        <Button onClick={this.newPartial}>Add partial</Button>
      </ButtonGroup>
    );
  }
}