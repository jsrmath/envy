import Note from './note';
import Envelope from './envelope';

const ctx = new (window.AudioContext || window.webkitAudioContext)();

const note = new Note(440, 1);
const env1 = new Envelope(1);
const env2 = new Envelope(1);
const env3 = new Envelope(1);

env1.addPoint(.25, Math.random());
env1.addPoint(.5, Math.random());
env1.addPoint(.75, Math.random());

env2.addPoint(.25, Math.random());
env2.addPoint(.5, Math.random());
env2.addPoint(.75, Math.random());

env3.addPoint(.25, Math.random());
env3.addPoint(.5, Math.random());
env3.addPoint(.75, Math.random());

note.setPartial(1, env1);
note.setPartial(2, env2);
note.setPartial(3, env3);

note.play(ctx, 2, .5);