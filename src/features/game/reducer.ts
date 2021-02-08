import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BulletState, RemainingColorsState } from './types';
import { ballColors, bulletStates } from './constants';

const initialBulletState: BulletState = {
  state: bulletStates.IDLE,
  color: ballColors.BLUE,
  angle: 0,
};

const initialRemainingColorsState: RemainingColorsState = {
  colors: [],
};

const bullet = createSlice({
  name: 'bullet',
  initialState: initialBulletState,
  reducers: {
    setState(state, { payload }: PayloadAction<BulletState>) {
      state.state = payload.state;
      state.color = payload.color;
      state.angle = payload.angle;
    },
  },
});

const remainingColors = createSlice({
  name: 'remainingColors',
  initialState: initialRemainingColorsState,
  reducers: {
    setColors(state, { payload }: PayloadAction<number[]>) {
      state.colors = payload;
    },
  },
});

export const bulletActions = bullet.actions;
export const bulletReducer = bullet.reducer;

export const remainingColorsActions = remainingColors.actions;
export const remainingColorsReducer = remainingColors.reducer;
