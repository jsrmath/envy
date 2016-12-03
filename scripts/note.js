import _ from 'underscore';

export default class {
  constructor(freq, exp) {
    this.freq = freq;
    this.exp = exp || 1; // A partial n has a max gain of 1 / n^exp
    this.partials = {};
  }

  getPartial(num) {
    return this.partials[num];
  }

  removePartial(num) {
    delete this.partials[num];
  }

  setPartial(num, env) {
    if (num < 1) throw new Error('Invalid partial');
    this.partials[num] = env;
  }

  setExp(exp) {
    this.exp = exp;
  }

  play(ctx, dur, gain) {
    dur = dur || 1;
    gain = gain || 1;

    _.each(this.partials, (env, num) => playEnvelope(
      ctx,
      env,
      this.freq * num,
      gain / Math.pow(num, this.exp),
      dur
    ));
  }
}

function playEnvelope(ctx, env, freq, gain, dur) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const now = ctx.currentTime;
  const durScale = dur / env.dur;
  const gainScale = gain / env.maxGain;

  osc.connect(gainNode);
  osc.frequency.value = freq;
  osc.type = 'sine';
  gainNode.connect(ctx.destination);
  gainNode.gain.value = 0;

  _.each(env.points, (pt) => {
    gainNode.gain.linearRampToValueAtTime(gainScale * pt.v, now + durScale * pt.t);
  });

  osc.start(now);
  osc.stop(now + dur);
}