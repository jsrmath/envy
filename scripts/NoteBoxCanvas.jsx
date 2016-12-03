import { numberToColor } from './color';
import _ from 'underscore';
import React from 'react';
import autoBind from 'react-autobind';
import 'fabric';

export default class extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);

    // Cache of the last lines we drew for easy removal
    this.lastLines = [];
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas(this.props.keyBinding, {
      width: this.props.canvasWidth,
      height: this.props.canvasHeight,
      selection: false
    });
    this.drawCanvas();
    this.setCanvasHandler();
  }

  componentDidUpdate() {
    this.canvas.clear();
    this.drawCanvas();
  }

  getLines(points, color, scale) {
    const lines = _.map(_.initial(points), (point, i) =>
      new fabric.Line(
        [
          point.t,
          this.props.canvasHeight - point.v * scale,
          points[i+1].t,
          this.props.canvasHeight - points[i+1].v * scale
        ], {
          fill: color,
          stroke: color,
          strokeWidth: 4,
          originX: 'center',
          originY: 'center',
          selectable: false,
          hoverCursor: 'default'
        }
      )
    );

    const lineConnectors = _.map(points, (point) => 
      new fabric.Circle({
        left: point.t,
        top: this.props.canvasHeight - point.v * scale,
        originX: 'center',
        originY: 'center',
        radius: 2,
        fill: color,
        strokeWidth: 0,
        selectable: false,
        hoverCursor: 'default'
      })
    );

    return lines.concat(lineConnectors);
  }

  drawAllPartials() {
    _.each(this.props.note.partials, (env, partial) => {
      const lines = this.getLines(env.points, numberToColor(partial), 1 / Math.pow(partial, this.props.note.exp));
      _.each(lines, (l) => this.canvas.add(l));
    });
  }

  drawLines() {
    const points = this.props.note.getPartial(this.props.partial).points;
    const color = numberToColor(this.props.partial);

    _.each(this.lastLines, this.canvas.remove.bind(this.canvas));

    const lines = this.getLines(points, color, 1);

    _.each(lines, (line) => {
      this.canvas.add(line);
      this.canvas.sendToBack(line);
    });

    this.lastLines = lines;
  }

  drawPoints() {
    _.each(this.props.note.getPartial(this.props.partial).points, (point, index) =>
      this.canvas.add(new fabric.Circle({
        left: point.t,
        top: this.props.canvasHeight - point.v,
        originX: 'center',
        originY: 'center',
        strokeWidth: 5,
        radius: 6,
        fill: '#fff',
        stroke: '#666',
        hasControls: false,
        hasBorders: false,
        lockMovementX: point.t === 0 || point.t === this.props.canvasWidth,
        previousLeft: point.t
      }))
    );
  }

  drawCanvas() {
    if (this.props.partial === null) {
      this.drawAllPartials();
    }
    else {
      this.drawPoints();
      this.drawLines();
    }
  }

  setCanvasHandler() {
    this.canvas.on('object:moving', (e) => {
      const env = this.props.note.getPartial(this.props.partial);

      // Prevent dragging points off screen
      if (e.target.left < 0) e.target.left = 0;
      if (e.target.left > this.props.canvasWidth) e.target.left = this.props.canvasWidth;
      if (e.target.top < 0) e.target.top = 0;
      if (e.target.top > this.props.canvasHeight) e.target.top = this.props.canvasHeight;

      // Prevent middle points from being dragged past start and end points
      if ((e.target.left === 0 && e.target.previousLeft !== 0) ||
          (e.target.left === this.props.canvasWidth && e.target.previousLeft !== this.props.canvasWidth)) {
        e.target.left = e.target.previousLeft;
      }

      env.changePoint(e.target.previousLeft, e.target.left, this.props.canvasHeight - e.target.top);
      e.target.previousLeft = e.target.left;
      this.drawLines(env.points);
    });
  }

  render() {
    return (
      <canvas className="note-box-canvas" id={this.props.keyBinding} />
    );
  }
}