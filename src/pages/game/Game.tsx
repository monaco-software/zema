import React, { FC, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Main } from 'grommet';
import b_ from 'b_';

import { BULLET_STATE, GAME_PHASE, GAME_RESULT } from './constants';
import { GAME_PHASE_TIMEOUTS, MESSAGES } from './setup';
import { ROUTES } from '../../common/constants';
import { BallsLayer } from './Layers/Balls';
import { TitleLayer } from './Layers/Title';
import { BackLayer } from './Layers/Back';
import { EffectsLayer } from './Layers/Effects';
import { FrogLayer } from './Layers/Frog';
import { getPath } from './lib/geometry';
import { getCurrentLevel, getGamePhase, getGameResult } from './selectors';
import levels from './levels';
import { gameActions } from './reducer';
import { UiLayer } from './Layers/Ui';
import { ScoreLayer } from './Layers/Score';
import { ComboLayer } from './Layers/Combo';
import { BlackoutLayer } from './Layers/Blackout';

import './game.css';

const block = b_.lock('game');

export const Game: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const level = useSelector(getCurrentLevel);
  const gamePhase = useSelector(getGamePhase);
  const gameResult = useSelector(getGameResult);

  const ballsPath = useMemo(() => getPath(levels[level].start, levels[level].curve), []);

  useEffect(() => {
    switch (gamePhase) {
      case GAME_PHASE.LOADED:
        dispatch(gameActions.setTitle(levels[level].title));
        setTimeout(() => dispatch(gameActions.setGamePhase(GAME_PHASE.STARTING)), GAME_PHASE_TIMEOUTS.LOADED);
        break;
      case GAME_PHASE.STARTING:
        dispatch(gameActions.setTitle(''));
        setTimeout(() => dispatch(gameActions.setGamePhase(GAME_PHASE.STARTED)), GAME_PHASE_TIMEOUTS.STARTING);
        break;
      case GAME_PHASE.ENDED:
        setTimeout(() => dispatch(gameActions.setGamePhase(GAME_PHASE.EXITING)), GAME_PHASE_TIMEOUTS.ENDED);
        if (gameResult === GAME_RESULT.WIN) {
          dispatch(gameActions.setTitle(MESSAGES.WIN));
        } else {
          dispatch(gameActions.setTitle(MESSAGES.FAIL));
        }
        break;
      case GAME_PHASE.EXITING:
        if (gameResult === GAME_RESULT.WIN) {
          history.push(ROUTES.GAME_LEVELS);
        } else {
          history.push(ROUTES.GAME_OVER);
        }
    }
  }, [gamePhase]);

  // init
  useEffect(() => {
    dispatch(gameActions.setRemainColors(levels[level].ballColors));
    const myFont = new FontFace('Bangers2', 'url(Bangers.ttf)');
    myFont.load().then(function(font) {
      document.fonts.add(font);
      document.body.style.fontFamily = 'Bangers2, serif';
      dispatch(gameActions.setGamePhase(GAME_PHASE.LOADED));
    });

    return () => {
      dispatch(gameActions.resetScore());
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
      dispatch(gameActions.setGamePhase(GAME_PHASE.LOADING));
      dispatch(gameActions.setShotPath([]));
      dispatch(gameActions.setGameResult(GAME_RESULT.WIN));
    };
  }, []);

  return (
    <div className={block()}>
      <Main justify="center" align="center">
        <BackLayer />
        <BallsLayer ballsPath={ballsPath} />
        <EffectsLayer ballsPath={ballsPath} />
        <FrogLayer />
        <ComboLayer />
        <ScoreLayer />
        <BlackoutLayer />
        <TitleLayer />
        <UiLayer />
      </Main>
    </div>
  );
};