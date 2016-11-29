import _ from 'underscore';

export default class {
  constructor(dur) {
    this.dur = dur || 1;
    this.points = [];
  }

  addPoint(t, v) {
    const point = _.findWhere(this.points, {t: t});

    if (t > this.dur || t < 0) throw new Error("Invalid envelope point");

    if (point) {
      point.v = v;
    }
    else {
      this.points.push({t: t, v: v});
    }
    this.points = _.sortBy(this.points, 't');
  }
}