import _ from 'underscore';
import React from 'react';
import autoBind from 'react-autobind';
import 'fabric';

// Cache of the last lines we drew for easy removal
let lastLines = [];

export default class extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentDidMount() {
    this.drawCanvas();
  }

  drawLines(points, canvas) {
    _.each(lastLines, canvas.remove.bind(canvas));

    const lines = _.map(_.initial(points), (point, i) =>
      new fabric.Line(
        [point.t, this.props.canvasHeight - point.v, points[i+1].t, this.props.canvasHeight - points[i+1].v],
        {
          fill: 'red',
          stroke: 'red',
          strokeWidth: 5,
          originX: 'center',
          originY: 'center',
          selectable: false
        }
      )
    );

    _.each(lines, (line) => {
      canvas.add(line);
      canvas.sendToBack(line);
    });

    lastLines = lines;
  }

  drawPoints(points, canvas) {
    _.each(points, (point, index) =>
      canvas.add(new fabric.Circle({
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
    const canvas = new fabric.Canvas(this.props.keyBinding, {
      width: this.props.canvasWidth,
      height: this.props.canvasHeight,
      selection: false
    });

    const env = this.props.note.getPartial(this.props.partial);

    this.drawPoints(env.points, canvas)
    this.drawLines(env.points, canvas);

    canvas.on('object:moving', (e) => {
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
      this.drawLines(env.points, canvas);
    });
  }

  render() {
    return (
      <canvas className="note-box-canvas" id={this.props.keyBinding} />
    );
  }
}