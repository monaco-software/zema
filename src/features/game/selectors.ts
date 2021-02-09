import { RootState } from '../../store/store';

export const getBulletState = (state: RootState) => state.game;

const getAppState = (state: RootState) => state.game;

export const getBullet = (state: RootState) => getAppState(state).bullet;
