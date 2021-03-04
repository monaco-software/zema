import levels from '../game/levels';
import { AppThunk } from '@store/store';
import { isJsonString } from '@common/utils';
import { gameLevelsActions } from './reducer';
import { LOCALSTORAGE_LEVELS } from './constants';

const inLevels = (n: number) => n >= 0 && n < levels.length;

export const asyncGameLevelActions = {

  // заглушка для микросервиса
  // на данный момент берет данные из localStorage
  fetchAllowedLevels: (): AppThunk<Promise<void>> => async (dispatch) => {
    const localStorageAllowedLevels = atob(localStorage.getItem(LOCALSTORAGE_LEVELS) || '');

    if (!localStorageAllowedLevels || !isJsonString(localStorageAllowedLevels)) {
      localStorage.setItem(LOCALSTORAGE_LEVELS, btoa(JSON.stringify([0])));
      dispatch(gameLevelsActions.setLevels([0]));
      return;
    }
    const allowedLevelsArray = JSON.parse(localStorageAllowedLevels) as number[];

    if (Array.isArray(allowedLevelsArray) && allowedLevelsArray.every(inLevels)) {
      dispatch(gameLevelsActions.setLevels(Array.from(new Set(allowedLevelsArray))));
      return;
    }
    throw new Error('Cant fetch allowedLevels');
  },

  // заглушка для микросервиса
  // на данный момент кладет данные в localStorage
  sendAllowedLevels: (levels: number[]): AppThunk<Promise<void>> => async (dispatch) => {
    if (!levels.every(inLevels)) {
      throw new Error(`Cant store levels ${levels}`);
    }
    localStorage.setItem(LOCALSTORAGE_LEVELS, btoa(JSON.stringify(levels)));
    dispatch(gameLevelsActions.setLevels(levels));
  },
};

