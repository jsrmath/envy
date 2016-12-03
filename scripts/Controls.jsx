import Envelope from './envelope';
import _ from 'underscore';
import React from 'react';
import autoBind from 'react-autobind';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

export default class extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  editPartialButtons() {
    return _.map(this.props.note.partials, (env, num) =>
      <Button
        className={classNames({disabled: this.props.partial === Number(num)})}
        key={num}
        onClick={() => this.props.setPartial(Number(num))}
      >
        Edit partial {num}
      </Button>
    );
  }

  newPartial() {
    const partial = Number(prompt("Enter a number greater than 1..."));
    const env = new Envelope(this.props.canvasWidth, this.props.canvasHeight);
    this.props.note.setPartial(partial, env);
    env.addDefaultPoints();
    this.props.setPartial(partial);
  }

  render() {
    // Awful overloading of the word partial happening here.
    // _.partial is totally unrelated to how partial is used throughout the codebase.
    return (
      <div>
        <Button onClick={_.partial(this.props.setPartial, null)}>View all partials</Button>
        {this.editPartialButtons()}
        <Button onClick={this.newPartial}>New partial</Button>
      </div>
    );
  }
}