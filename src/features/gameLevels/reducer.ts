import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameLevels {
  allowedLevels: number[];
}

const initialLevels: GameLevels = {
  allowedLevels: [],
};

const levels = createSlice({
  name: 'levels',
  initialState: initialLevels,
  reducers: {
    setLevels(state, { payload }: PayloadAction<GameLevels['allowedLevels']>) {
      state.allowedLevels = payload;
    },
  },
});

export const gameLevelsActions = levels.actions;
export const gameLevelsReducer = levels.reducer;
