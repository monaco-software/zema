import './game.css';

import React, { FC, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Main } from 'grommet';
import b_ from 'b_';

import { BULLET_STATE, GAME_PHASE, GAME_RESULT } from './constants';
import { GAME_PHASE_TIMEOUTS, MESSAGES } from './setup';
import { ROUTES } from '../../common/constants';

import { asyncGameLevelActions } from '../gameLevels/asyncActions';
import { useAction, useAsyncAction } from '../../hooks';
import { gameActions } from './reducer';
import { getCurrentLevel, getGamePhase, getGameResult } from './selectors';
import { getAllowedLevels } from '../gameLevels/selectors';
import { uniqAndSort } from '../../common/utils';

import levels from './levels';
import { getPath } from './lib/geometry';
import { BallsLayer } from './Layers/Balls';
import { TitleLayer } from './Layers/Title';
import { BackLayer } from './Layers/Back';
import { EffectsLayer } from './Layers/Effects';
import { FrogLayer } from './Layers/Frog';
import { UiLayer } from './Layers/Ui';
import { ScoreLayer } from './Layers/Score';
import { ComboLayer } from './Layers/Combo';
import { BlackoutLayer } from './Layers/Blackout';
import { SkullLayer } from './Layers/Skull';
import { BulletLayer } from './Layers/Bullet';
import { InfoLayer } from './Layers/Info';

const block = b_.lock('game');

export const Game: FC = () => {
  const resetScore = useAction(gameActions.resetScore);
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

  const sendAllowedLevels = useAsyncAction(asyncGameLevelActions.sendAllowedLevels);

  const ballsPath = useMemo(() => getPath(levels[level].start, levels[level].curve), []);

  const timeoutRef = useRef<number>();

  useEffect(() => {
    switch (gamePhase) {
      case GAME_PHASE.LOADED:
        setTitle( `Level ${level + 1}\n\n${levels[level].title}`);
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
        }
        break;
      case GAME_PHASE.ENDED:
        timeoutRef.current = window.setTimeout(
          () => setGamePhase(GAME_PHASE.EXITING),
          GAME_PHASE_TIMEOUTS.ENDED
        );
        if (gameResult === GAME_RESULT.WIN) {
          setTitle(MESSAGES.WIN);
        } else {
          setTitle(MESSAGES.FAIL);
        }
        break;
      case GAME_PHASE.EXITING:
        if (gameResult === GAME_RESULT.WIN) {
          if (level + 1 < levels.length) {
            const allowedLevelsCopy = allowedLevels.slice();
            allowedLevelsCopy.push(level + 1);
            sendAllowedLevels(uniqAndSort(allowedLevelsCopy))
              .finally(() => {
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
    const myFont = new FontFace('Bangers2', 'url(Bangers.ttf)');
    myFont.load().then(function(font) {
      document.fonts.add(font);
      document.body.style.fontFamily = 'Bangers2, serif';
      setGamePhase(GAME_PHASE.LOADED);
    });

    return () => {
      resetScore();
      setBulletState(BULLET_STATE.IDLE);
      setGamePhase(GAME_PHASE.LOADING);
      setShotPath([]);
      setGameResult(GAME_RESULT.WIN);
    };
  }, []);

  return (
    <div className={block()}>
      <Main justify="center" align="center">
        <BackLayer />
        <BallsLayer ballsPath={ballsPath} />
        <EffectsLayer ballsPath={ballsPath} />
        <SkullLayer />
        <BulletLayer />
        <FrogLayer />
        <ComboLayer />
        <ScoreLayer />
        <BlackoutLayer />
        <TitleLayer />
        <InfoLayer />
        <UiLayer />
      </Main>
    </div>
  );
};
