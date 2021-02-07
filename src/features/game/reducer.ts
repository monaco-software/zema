import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BulletState } from './types';
import { ballColors, bulletStates } from './constants';

const initialState: BulletState = {
  state: bulletStates.IDLE,
  color: ballColors.BLUE,
  angle: 0,
};

const bullet = createSlice({
  name: 'bullet',
  initialState,
  reducers: {
    setState(state, { payload }: PayloadAction<BulletState>) {
      state.state = payload.state;
      state.color = payload.color;
      state.angle = payload.angle;
    },
  },
});

export const bulletActions = bullet.actions;
export const bulletReducer = bullet.reducer;
