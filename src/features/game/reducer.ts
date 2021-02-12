import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BALL_COLORS, BULLET_STATE, GAME_PHASE } from './constants';

interface Game {
  phase: number;
  bullet: {
    state: BULLET_STATE;
    color: BALL_COLORS;
    angle: number;
    position: number;
  };
  colors: number[];
  currentLevel: number;
  openedLevel: number;
  explosion: number;
  particle: number;
}

const initialGame: Game = {
  phase: GAME_PHASE.IDLE,
  bullet: {
    state: BULLET_STATE.IDLE,
    color: BALL_COLORS.BLUE,
    angle: 0,
    position: 0,
  },
  colors: [],
  currentLevel: 0,
  openedLevel: 0,
  explosion: -1,
  particle: -1,
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
    setColors(state, { payload }: PayloadAction<Game['colors']>) {
      state.colors = payload;
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
  },
});

export const gameActions = game.actions;
export const gameReducer = game.reducer;
