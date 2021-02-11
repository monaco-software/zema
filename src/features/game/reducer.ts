import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BALL_COLORS, BULLET_STATE } from './constants';

interface GameState {
  bullet: {
    state: BULLET_STATE;
    color: BALL_COLORS;
    angle: number;
    position: number;
  };
  colors: number[];
  currentLevel: number;
  openedLevel: number;
}

const initialGameState: GameState = {
  bullet: {
    state: BULLET_STATE.IDLE,
    color: BALL_COLORS.BLUE,
    angle: 0,
    position: 0,
  },
  colors: [],
  currentLevel: 0,
  openedLevel: 0,
};

const game = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    setBullet(state, { payload }: PayloadAction<GameState['bullet']>) {
      state.bullet = payload;
    },
    setBulletPosition(state, { payload }: PayloadAction<GameState['bullet']['position']>) {
      state.bullet.position = payload;
    },
    setBulletState(state, { payload }: PayloadAction<GameState['bullet']['state']>) {
      state.bullet.state = payload;
    },
    setBulletColor(state, { payload }: PayloadAction<GameState['bullet']['color']>) {
      state.bullet.color = payload;
    },
    setColors(state, { payload }: PayloadAction<GameState['colors']>) {
      state.colors = payload;
    },
    setCurrentLevel(state, { payload }: PayloadAction<GameState['currentLevel']>) {
      state.currentLevel = payload;
    },
    setOpenedLevel(state, { payload }: PayloadAction<GameState['openedLevel']>) {
      state.openedLevel = payload;
    },
  },
});

export const gameActions = game.actions;
export const gameReducer = game.reducer;
