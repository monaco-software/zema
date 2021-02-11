import { RootState } from '../../store/store';

const getAppState = (state: RootState) => state.game;

export const getCurrentLevel = (state: RootState) => getAppState(state).currentLevel;
export const getBullet = (state: RootState) => getAppState(state).bullet;
export const getBulletState = (state: RootState) => getAppState(state).bullet.state;
export const getBulletPosition = (state: RootState) => getAppState(state).bullet.position;
export const getBulletColor = (state: RootState) => getAppState(state).bullet.color;
export const getRemainColors = (state: RootState) => getAppState(state).colors;
