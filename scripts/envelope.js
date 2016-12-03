import _ from 'underscore';

export default class {
  constructor(dur, maxGain) {
    this.dur = dur || 1;
    this.maxGain = maxGain || 1;
    this.points = [];
  }

  addDefaultPoints() {
    const NUM_POINTS = 4;
    const unit = this.dur / NUM_POINTS;

    for (let i = 0; i <= NUM_POINTS - 1; i += 1) {
      this.addPoint(unit * i, this.maxGain / 2);
    }

    this.addPoint(this.dur, 0);
  }

  removePoint(t) {
    const index = _.findIndex(this.points, (p) => p.t === t);

    if (index > -1) {
      this.points.splice(index, 1);
    }
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

  changePoint(oldT, newT, v) {
    this.removePoint(oldT);
    this.addPoint(newT, v);
  }
}