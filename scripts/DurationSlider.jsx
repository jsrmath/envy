import React from 'react';
import autoBind from 'react-autobind';

export default class extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleChange(e) {
    this.props.note.setDur(Number(e.target.value));
    this.forceUpdate();
  }

  render() {
    return (
      <div className="slider-wrapper">
        <input
          type="range"
          className="duration-slider"
          value={this.props.note.dur}
          onChange={this.handleChange}
          step={0.1}
          min={0.1}
          max={2} />
        <span className="note-attribute note-duration">{`${this.props.note.dur} s`}</span>
      </div>
    );
  }
}