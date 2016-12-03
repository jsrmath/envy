import Envelope from './envelope';
import _ from 'underscore';
import React from 'react';
import autoBind from 'react-autobind';
import { Button } from 'react-bootstrap';
import classNames from 'classnames';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partial: 1
    };
    autoBind(this);
  }

  editPartialButtons() {
    return _.map(this.props.note.partials, (env, num) =>
      <Button className={classNames({disabled: this.state.partial === Number(num)})} key={num}>
        Edit partial {num}
      </Button>
    );
  }

  newPartial() {
    const partial = Number(prompt("Enter a number greater than 1..."));
    const env = new Envelope(partial);
    this.props.note.setPartial(partial, env);
    env.addDefaultPoints();
    this.setState({partial: partial});
  }

  render() {
    return (
      <div>
        <Button>View all partials</Button>
        {this.editPartialButtons()}
        <Button onClick={this.newPartial}>New partial</Button>
      </div>
    );
  }
}