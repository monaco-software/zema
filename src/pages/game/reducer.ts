import { DEFAULT_VOLUME } from '@pages/game/setup';
import { ICONS } from '@pages/game/Layers/utils/buttons';
import { asyncGameActions } from '@pages/game/asyncActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BALL_COLORS, BULLET_STATE, GAME_PHASE, GAME_RESULT, MAX_VOLUME, MIN_VOLUME, VOLUME_STEP } from './constants';

export interface IGameButton {
  icon: string;
  x: number;
  y: number;
  hovered: boolean;
}

interface Game {
  phase: number;
  bullet: {
    state: BULLET_STATE;
    color: number;
    angle: number;
    position: number;
  };
  remainColors: number[];
  currentLevel: number;
  openedLevel: number;
  explosion: number[];
  particle: number;
  pusher: number;
  shotPath: number[][];
  shotPosition: number;
  gameResult: number;
  title: string;
  score: number;
  combo: number;
  fullscreenState: boolean;
  fullscreenButton: IGameButton;
  pauseButton: IGameButton;
  muteState: boolean;
  muteButton: IGameButton;
  volume: number;
  increaseVolumeButton: IGameButton;
  decreaseVolumeButton: IGameButton;
}

const initialGame: Game = {
  phase: GAME_PHASE.LOADING,
  bullet: {
    state: BULLET_STATE.IDLE,
    color: BALL_COLORS.BLUE,
    angle: 0,
    position: -1,
  },
  remainColors: [],
  currentLevel: 0,
  openedLevel: 0,
  explosion: [],
  particle: -1,
  pusher: Number.MIN_SAFE_INTEGER,
  shotPath: [],
  shotPosition: 0,
  gameResult: GAME_RESULT.UNKNOWN,
  title: '',
  score: 0,
  combo: 0,
  fullscreenState: false,
  fullscreenButton: { x: 0, y: 0, icon: ICONS.EXPAND, hovered: false },
  pauseButton: { x: 0, y: 0, icon: ICONS.PAUSE, hovered: false },
  muteState: false,
  muteButton: { x: 0, y: 0, icon: ICONS.MUTE, hovered: false },
  volume: DEFAULT_VOLUME,
  increaseVolumeButton: { x: 0, y: 0, icon: ICONS.INCREASE_VOLUME, hovered: false },
  decreaseVolumeButton: { x: 0, y: 0, icon: ICONS.DECREASE_VOLUME, hovered: false },
};

const game = createSlice({
  name: 'game',
  initialState: initialGame,
  reducers: {
    setBullet(state, { payload }: PayloadAction<Game['bullet']>) {
      state.bullet = payload;
    },
    setBulletPosition(state, { payload }: PayloadAction<Game['bullet']['position']>) {
      state.bullet.position = payload;
    },
    setBulletState(state, { payload }: PayloadAction<Game['bullet']['state']>) {
      state.bullet.state = payload;
    },
    setBulletColor(state, { payload }: PayloadAction<Game['bullet']['color']>) {
      state.bullet.color = payload;
    },
    setRemainColors(state, { payload }: PayloadAction<Game['remainColors']>) {
      state.remainColors = payload;
    },
    setCurrentLevel(state, { payload }: PayloadAction<Game['currentLevel']>) {
      state.currentLevel = payload;
    },
    setOpenedLevel(state, { payload }: PayloadAction<Game['openedLevel']>) {
      state.openedLevel = payload;
    },
    setExplosion(state, { payload }: PayloadAction<Game['explosion']>) {
      state.explosion = payload;
    },
    setParticle(state, { payload }: PayloadAction<Game['particle']>) {
      state.particle = payload;
    },
    setGamePhase(state, { payload }: PayloadAction<Game['phase']>) {
      state.phase = payload;
    },
    setGameResult(state, { payload }: PayloadAction<Game['gameResult']>) {
      state.gameResult = payload;
    },
    increasePusher(state, { payload }: PayloadAction<Game['pusher']>) {
      state.pusher += payload ? payload : 1;
    },
    setShotPath(state, { payload }: PayloadAction<Game['shotPath']>) {
      state.shotPath = payload;
    },
    setShotPosition(state, { payload }: PayloadAction<Game['shotPosition']>) {
      state.shotPosition = payload;
    },
    setTitle(state, { payload }: PayloadAction<Game['title']>) {
      state.title = payload;
    },
    setFullscreenState(state, { payload }: PayloadAction<Game['fullscreenState']>) {
      state.fullscreenState = payload;
    },
    setFullscreenButton(state, { payload }: PayloadAction<Game['fullscreenButton']>) {
      state.fullscreenButton = payload;
    },
    setPauseButton(state, { payload }: PayloadAction<Game['pauseButton']>) {
      state.pauseButton = payload;
    },
    setMuteState(state, { payload }: PayloadAction<Game['muteState']>) {
      state.muteState = payload;
    },
    setMuteButton(state, { payload }: PayloadAction<Game['muteButton']>) {
      state.muteButton = payload;
    },
    setIncreaseVolumeButton(state, { payload }: PayloadAction<Game['increaseVolumeButton']>) {
      state.increaseVolumeButton = payload;
    },
    setDecreaseVolumeButton(state, { payload }: PayloadAction<Game['decreaseVolumeButton']>) {
      state.decreaseVolumeButton = payload;
    },
    setVolume(state, { payload }: PayloadAction<Game['volume']>) {
      if (payload > MAX_VOLUME || payload < MIN_VOLUME) {
        throw new Error( `Volume value ${payload} out of range`);
      }
      state.volume = payload;
    },
    increaseVolume(state) {
      if (state.volume + VOLUME_STEP <= MAX_VOLUME) {
        state.volume += VOLUME_STEP;
        asyncGameActions.sendVolume(state.volume).catch(console.error);
      }
    },
    decreaseVolume(state) {
      if (state.volume - VOLUME_STEP >= MIN_VOLUME) {
        state.volume -= VOLUME_STEP;
        asyncGameActions.sendVolume(state.volume).catch(console.error);
      }
    },
    increaseScore(state, { payload }: PayloadAction<Game['score']>) {
      state.score += payload;
    },
    incrementCombo(state) {
      state.combo += 1;
    },
    resetCombo(state) {
      state.combo = 0;
    },
    resetScore(state) {
      state.score = 0;
    },
  },
});

export const gameActions = game.actions;
export const gameReducer = game.reducer;
