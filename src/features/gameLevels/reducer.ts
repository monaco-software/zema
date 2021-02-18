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
    addLevel(state, { payload }: PayloadAction<number>) {
      if (state.allowedLevels.includes(payload)) { return; }
      state.allowedLevels.push(payload);
    },
    setLevels(state, { payload }: PayloadAction<GameLevels['allowedLevels']>) {
      if (!state.allowedLevels.length) {
        state.allowedLevels = payload;
      }
    },
  },
});

export const gameLevelsActions = levels.actions;
export const gameLevelsReducer = levels.reducer;
