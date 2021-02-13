import React, { FC, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import b_ from 'b_';

import { BallsLayer } from './Layers/Balls';
import { BackLayer } from './Layers/Back';
import { EffectsLayer } from './Layers/Effects';
import { FrogLayer } from './Layers/Frog';
import { getPath } from './lib/geometry';
import { getCurrentLevel, getGamePhase, getGameResult } from './selectors';
import levels from './levels';
import { gameActions } from './reducer';
import { GAME_PHASE, GAME_PHASE_TIMEOUTS, GAME_RESULT, MESSAGES } from './constants';
import { UiLayer } from './Layers/Ui';

const block = b_.lock('game');

export const Game: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const level = useSelector(getCurrentLevel);
  const gamePhase = useSelector(getGamePhase);
  const gameResult = useSelector(getGameResult);

  const ballsPath = useMemo(() => getPath(levels[level].start, levels[level].curve), []);

  useEffect(() => {
    console.log(gamePhase);
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
        break;
    }

    if (gamePhase === GAME_PHASE.ENDING) {
      if (gameResult === GAME_RESULT.WIN) {
        dispatch(gameActions.setTitle(MESSAGES.WIN));
        // history.push(ROUTES.GAME_LEVELS);
      } else {
        dispatch(gameActions.setTitle(MESSAGES.FAIL));
        // history.push(ROUTES.GAME_OVER);
      }
    }
  }, [gamePhase]);

  // init
  useEffect(() => {
    dispatch(gameActions.setRemainColors(levels[level].ballColors));
    return;
  }, []);

  return (
    <div className={block()}>
      <BackLayer /> <BallsLayer ballsPath={ballsPath} /> <EffectsLayer ballsPath={ballsPath} /> <FrogLayer /> <UiLayer />
      <br />
      <button onClick={() => history.goBack()}>Go back</button>
    </div>
  );
};
