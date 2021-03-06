import { RootState } from '@store/store';

const getAppState = (state: RootState) => state.game;

export const getCurrentLevel = (state: RootState) =>
  getAppState(state).currentLevel;
export const getBulletState = (state: RootState) =>
  getAppState(state).bullet.state;
export const getBulletPosition = (state: RootState) =>
  getAppState(state).bullet.position;
export const getBulletColor = (state: RootState) =>
  getAppState(state).bullet.color;
export const getRemainColors = (state: RootState) =>
  getAppState(state).remainColors;
export const getExplosion = (state: RootState) => getAppState(state).explosion;
export const getGamePhase = (state: RootState) => getAppState(state).phase;
export const getGameResult = (state: RootState) =>
  getAppState(state).gameResult;
export const getShotPath = (state: RootState) => getAppState(state).shotPath;
export const getShotPosition = (state: RootState) =>
  getAppState(state).shotPosition;
export const getTitle = (state: RootState) => getAppState(state).title;
export const getScore = (state: RootState) => getAppState(state).score;
export const getCombo = (state: RootState) => getAppState(state).combo;
export const getFullscreenState = (state: RootState) =>
  getAppState(state).fullscreenState;
export const getFullscreenButton = (state: RootState) =>
  getAppState(state).fullscreenButton;
export const getPauseButton = (state: RootState) =>
  getAppState(state).pauseButton;
export const getMuteState = (state: RootState) => getAppState(state).muteState;
export const getMuteButton = (state: RootState) =>
  getAppState(state).muteButton;
export const getIncreaseVolumeButton = (state: RootState) =>
  getAppState(state).increaseVolumeButton;
export const getDecreaseVolumeButton = (state: RootState) =>
  getAppState(state).decreaseVolumeButton;
export const getVolume = (state: RootState) => getAppState(state).volume;
export const getConsoleMode = (state: RootState) =>
  getAppState(state).consoleMode;
