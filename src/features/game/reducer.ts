import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BALL_COLORS, BULLET_STATE } from './constants';

interface GameState {
  bullet: {
    state: BULLET_STATE;
    color: BALL_COLORS;
    angle: number;
  };
  colors: number[];
}

const initialGameState: GameState = {
  bullet: {
    state: BULLET_STATE.IDLE,
    color: BALL_COLORS.BLUE,
    angle: 0,
  },
  colors: [],
};

const game = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    setBullet(state, { payload }: PayloadAction<GameState['bullet']>) {
      state.bullet = payload;
    },
    setColors(state, { payload }: PayloadAction<GameState['colors']>) {
      state.colors = payload;
    },
  },
});

export const gameActions = game.actions;
export const gameReducer = game.reducer;

