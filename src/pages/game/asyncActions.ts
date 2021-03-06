import { AppThunk } from '@store/store';
import { gameActions } from './reducer';
import { setVolume } from '@pages/game/lib/sound';
import { DEFAULT_VOLUME } from '@pages/game/setup';
import { LOCALSTORAGE_VOLUME, MAX_VOLUME, MIN_VOLUME } from './constants';

export const asyncGameActions = {
  // заглушка для микросервиса
  // на данный момент берет данные из localStorage
  fetchVolume: (): AppThunk<Promise<void>> => async (dispatch) => {
    const localStorageVolume = atob(
      localStorage.getItem(LOCALSTORAGE_VOLUME) || ''
    );

    if (!localStorageVolume) {
      localStorage.setItem(
        LOCALSTORAGE_VOLUME,
        btoa(JSON.stringify(DEFAULT_VOLUME))
      );
      dispatch(gameActions.setVolume(DEFAULT_VOLUME));
      return;
    }
    const localStorageVolumeValue = parseInt(localStorageVolume, 10);

    if (
      !Number.isNaN(localStorageVolumeValue) &&
      localStorageVolumeValue <= MAX_VOLUME &&
      localStorageVolumeValue >= MIN_VOLUME
    ) {
      setVolume(localStorageVolumeValue);
      dispatch(gameActions.setVolume(localStorageVolumeValue));
      return;
    }
    throw new Error('Cant fetch volumeValue');
  },

  // заглушка для микросервиса
  // на данный момент кладет данные в localStorage
  sendVolume: (volume: number): AppThunk<Promise<void>> => async (dispatch) => {
    if (volume > MAX_VOLUME || volume < MIN_VOLUME) {
      throw new Error(`Volume value ${volume} out of range`);
    }
    localStorage.setItem(
      LOCALSTORAGE_VOLUME,
      btoa(Math.floor(volume).toString(10))
    );
    setVolume(volume);
    dispatch(gameActions.setVolume(volume));
  },
};
