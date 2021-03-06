import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BALL_COLORS, BULLET_STATE, GAME_PHASE, GAME_RESULT } from './constants';

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
  gameResult: GAME_RESULT.WIN,
  title: '',
  score: 0,
  combo: 0,
  fullscreenState: false,
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
