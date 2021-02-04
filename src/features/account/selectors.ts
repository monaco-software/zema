import { RootState } from '../../store';

const getAccountState = (state: RootState) => state.account;

export const getAccountName = (state: RootState) => getAccountState(state).name;

export const getAccountEmail = (state: RootState) => getAccountState(state).email;
