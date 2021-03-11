import win from '../assets/sounds/win.mp3';
import gulp from '../assets/sounds/gulp.mp3';
import lose from '../assets/sounds/lose.mp3';
import miss from '../assets/sounds/miss.mp3';
import shot from '../assets/sounds/shot.mp3';
import clash from '../assets/sounds/clash.mp3';
import combo from '../assets/sounds/combo.mp3';
import boom_0 from '../assets/sounds/boom_0.mp3';
import boom_1 from '../assets/sounds/boom_1.mp3';
import boom_2 from '../assets/sounds/boom_2.mp3';
import boom_3 from '../assets/sounds/boom_3.mp3';
import boom_4 from '../assets/sounds/boom_4.mp3';
import boom_5 from '../assets/sounds/boom_5.mp3';
import loaded from '../assets/sounds/loaded.mp3';
import knock_0 from '../assets/sounds/knock_0.mp3';
import knock_1 from '../assets/sounds/knock_1.mp3';
import knock_2 from '../assets/sounds/knock_2.mp3';
import starting from '../assets/sounds/starting.mp3';
import { store } from '@store/store';
import { random } from '@pages/game/lib/utils';
import { DEFAULT_VOLUME } from '@pages/game/setup';
import { MAX_VOLUME, MIN_VOLUME } from '@pages/game/constants';

type GameSounds = {
  [key: string]: string[];
};

type GameAudio = {
  [key: string]: AudioBuffer | undefined;
};

export const SOUNDS: GameSounds = Object.freeze({
  KNOCK: [knock_0, knock_1, knock_2],
  BOOM: [boom_0, boom_1, boom_2, boom_3, boom_4, boom_5],
  COMBO: [combo],
  MISS: [miss],
  GULP: [gulp],
  CLASH: [clash],
  SHOT: [shot],
  STARTING: [starting],
  LOADED: [loaded],
  WIN: [win],
  LOSE: [lose],
});

const sounds: GameAudio = {};

let audioCtx: AudioContext;
let volumeNode: GainNode;

const loadFile = (file: string): Promise<AudioBuffer | undefined> => {
  return fetch(file)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioCtx.decodeAudioData(buffer))
    .catch((e) => {
      console.error(e);
      return undefined;
    });
};

const play = (audioBuffer: AudioBuffer): void => {
  const trackSource = audioCtx.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(volumeNode);
  trackSource.start();
};

function playTrack(audioBuffer: AudioBuffer): void {
  if (!audioCtx) {
    console.error('audioCtx undefined');
    return;
  }
  if (audioCtx.state === 'suspended' || audioCtx.state === 'closed') {
    audioCtx.resume().then(() => {
      play(audioBuffer);
    });
    return;
  }
  play(audioBuffer);
}

export const playSound = (sound: string[]): void => {
  if (store.getState().game.muteState) {
    volumeNode.gain.setValueAtTime(0, audioCtx.currentTime);
    return;
  }
  if (!sound.length) {
    return;
  }
  const sample = sound[random(sound.length)];
  if (sounds[sample]) {
    playTrack(sounds[sample] as AudioBuffer);
  }
};

export const mute = () => {
  volumeNode.gain.setValueAtTime(0, audioCtx.currentTime);
};

export const setVolume = (volume: number) => {
  if (volume < MIN_VOLUME || volume > MAX_VOLUME) { return; }
  volumeNode.gain.setValueAtTime(volume / MAX_VOLUME, audioCtx.currentTime);
};

export const initSound = (volume = DEFAULT_VOLUME / MAX_VOLUME): Array<Promise<AudioBuffer | undefined>> => {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    volumeNode = audioCtx.createGain();
    volumeNode.gain.value = volume;
    volumeNode.connect(audioCtx.destination);
  }

  const loadPromises: Array<Promise<AudioBuffer | undefined>> = [];

  Object.values(SOUNDS).forEach((e) => {
    e.forEach((sample) => {
      if (sounds[sample] instanceof AudioBuffer) { return; }
      (async () => {
        const promise = loadFile(sample);
        loadPromises.push(promise);
        sounds[sample] = await promise;
      })();
    });
  });
  return loadPromises;
};

