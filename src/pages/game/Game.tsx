import './game.css';
import b_ from 'b_';
import levels from './levels';
import React, { FC, useEffect, useRef } from 'react';
import { gameActions } from './reducer';
import { useSelector } from 'react-redux';
import { ROUTES } from '@common/constants';
<<<<<<< HEAD
import { uniqAndSort } from '@common/utils';
import { useHistory } from 'react-router-dom';
import { GAME_PHASE_TIMEOUTS, MESSAGES } from './setup';
import { useAction, useAsyncAction } from '@common/hooks';
import { getAllowedLevels } from '../gameLevels/selectors';
import { UserInterface } from './components/UserInterface';
=======
import { getText } from '@common/langUtils';
import { useHistory } from 'react-router-dom';
import { GAME_PHASE_TIMEOUTS } from './setup';
import { isServer, uniqAndSort } from '@common/utils';
import { useAction, useAsyncAction } from '@common/hooks';
import { getAllowedLevels } from '../gameLevels/selectors';
import { asyncGameActions } from '@pages/game/asyncActions';
import { UserInterface } from './UserInterface/UserInterface';
>>>>>>> dev
import { asyncGameLevelActions } from '../gameLevels/asyncActions';
import { BULLET_STATE, GAME_PHASE, GAME_RESULT } from './constants';
import { initSound, playSound, SOUNDS } from '@pages/game/lib/sound';
import { asyncLeaderboardActions } from '@pages/leaderboard/asyncActions';
import {
  getCurrentLevel,
  getGamePhase,
  getGameResult,
  getScore,
} from './selectors';

const block = b_.lock('game');

export const Game: FC = () => {
  const resetScore = useAction(gameActions.resetScore);
  const resetCombo = useAction(gameActions.resetCombo);
  const setTitle = useAction(gameActions.setTitle);
  const setRemainColors = useAction(gameActions.setRemainColors);
  const setShotPath = useAction(gameActions.setShotPath);
  const setGameResult = useAction(gameActions.setGameResult);
  const setBulletState = useAction(gameActions.setBulletState);
  const setGamePhase = useAction(gameActions.setGamePhase);

  const history = useHistory();

  const level = useSelector(getCurrentLevel);
  const gamePhase = useSelector(getGamePhase);
  const gameResult = useSelector(getGameResult);
  const allowedLevels = useSelector(getAllowedLevels);
  const score = useSelector(getScore);

<<<<<<< HEAD
  const sendAllowedLevels = useAsyncAction(asyncGameLevelActions.sendAllowedLevels);
=======
  const sendAllowedLevels = useAsyncAction(
    asyncGameLevelActions.sendAllowedLevels
  );
  const fetchVolume = useAsyncAction(asyncGameActions.fetchVolume);
  const updateLeaderboard = useAsyncAction(
    asyncLeaderboardActions.updateLeaderboard
  );
>>>>>>> dev

  const timeoutRef = useRef<number>();

  useEffect(() => {
    switch (gamePhase) {
      case GAME_PHASE.LOADED:
        setTitle(`Level ${level + 1}\n\n${levels[level].title}`);
        timeoutRef.current = window.setTimeout(
          () => setGamePhase(GAME_PHASE.STARTING),
          GAME_PHASE_TIMEOUTS.LOADED
        );
        break;
      case GAME_PHASE.STARTING:
        setTitle('');
        timeoutRef.current = window.setTimeout(
          () => setGamePhase(GAME_PHASE.STARTED),
          GAME_PHASE_TIMEOUTS.STARTING
        );
        break;
      case GAME_PHASE.ENDING:
        if (gameResult === GAME_RESULT.WIN) {
          timeoutRef.current = window.setTimeout(
            () => setGamePhase(GAME_PHASE.ENDED),
            GAME_PHASE_TIMEOUTS.ENDING
          );

          updateLeaderboard({ points: score });
        }
        break;
      case GAME_PHASE.ENDED:
        timeoutRef.current = window.setTimeout(
          () => setGamePhase(GAME_PHASE.EXITING),
          GAME_PHASE_TIMEOUTS.ENDED
        );
        if (gameResult === GAME_RESULT.WIN) {
          setTitle(getText('game_messages_win'));
        } else {
          setTitle(getText('game_messages_fail'));
        }
        break;
      case GAME_PHASE.EXITING:
        if (gameResult === GAME_RESULT.WIN) {
          if (level + 1 < levels.length) {
            const allowedLevelsCopy = allowedLevels.slice();
            allowedLevelsCopy.push(level + 1);
            sendAllowedLevels(uniqAndSort(allowedLevelsCopy)).finally(() => {
              history.push(ROUTES.GAME_LEVELS);
            });
            break;
          }
          // если уровень - последний
          history.push(ROUTES.LEADERBOARD);
          break;
        }
        // если проиграл
        history.push(ROUTES.GAME_OVER);
    }
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [gamePhase]);

  // init
  useEffect(() => {
    if (!allowedLevels.length) {
      history.push(ROUTES.GAME_LEVELS);
      return;
    }
    setRemainColors(levels[level].ballColors);

    const myFont = new FontFace('BangersLocal', 'url(Bangers.ttf)');
    myFont.load().then(function (font) {
      document.fonts.add(font);
      document.body.style.fontFamily = 'BangersLocal';
      Promise.all(initSound()).then(() => {
        fetchVolume().catch(console.error);
        playSound(SOUNDS.LOADED);
        setGamePhase(GAME_PHASE.LOADED);
      });
    });

    return () => {
      setTitle('');
      resetScore();
      resetCombo();
      setBulletState(BULLET_STATE.IDLE);
      setGamePhase(GAME_PHASE.LOADING);
      setShotPath([]);
      setGameResult(GAME_RESULT.UNKNOWN);
    };
  }, []);

<<<<<<< HEAD
  return (
    <div className={block()}>
      <UserInterface />
    </div>
  );
=======
  return <div className={block()}>{!isServer && <UserInterface />}</div>;
>>>>>>> dev
};
