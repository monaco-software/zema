import { RootState } from '../../store/store';

const getAppState = (state: RootState) => state.gameLevels;

export const getAllowedLevels = (state: RootState) => getAppState(state).allowedLevels;
