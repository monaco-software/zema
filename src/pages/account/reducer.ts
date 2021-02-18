import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountState } from './types';

const initialState: AccountState = {
  name: '',
  email: '',
};

const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccountName(state, { payload }: PayloadAction<AccountState['name']>) {
      state.name = payload;
    },
    setAccountEmail(state, { payload }: PayloadAction<AccountState['email']>) {
      state.email = payload;
    },
  },
});

export const accountActions = account.actions;
export const accountReducer = account.reducer;
