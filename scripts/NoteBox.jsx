import NoteBoxCanvas from './NoteBoxCanvas.jsx';
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
    return (
      <div onClick={this.props.handleClick}>
        <NoteBoxCanvas {...this.props} />
      </div>
    );
  }
}