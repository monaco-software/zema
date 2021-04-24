// Модуль взаимодействует с пользователем
// слушает мышь и рассчитывает путь пули

// слушает мышь и рассчитывает путь пули
import levels from '../levels';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { gameActions } from '../reducer';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { getPath } from '../lib/geometry';
import { FrogLayer } from '../Layers/Frog';
import { BackLayer } from '../Layers/Back';
import { InfoLayer } from '../Layers/Info';
import { fps } from '@pages/game/lib/utils';
import { BallsLayer } from '../Layers/Balls';
import { SkullLayer } from '../Layers/Skull';
import { ComboLayer } from '../Layers/Combo';
import { ScoreLayer } from '../Layers/Score';
import { TitleLayer } from '../Layers/Title';
import { BulletLayer } from '../Layers/Bullet';
import { EffectsLayer } from '../Layers/Effects';
import { ButtonsLayer } from '../Layers/Buttons';
import { BlackoutLayer } from '../Layers/Blackout';
import { FullscreenButton } from './buttons/Fullscreen';
import { BULLET_TICK_DISTANCE, DEFAULT_FRAMERATE } from '../setup';
import { MuteButton } from '@pages/game/UserInterface/buttons/Mute';
import { PauseButton } from '@pages/game/UserInterface/buttons/Pause';
import { DecreaseVolumeButton } from '@pages/game/UserInterface/buttons/DecreaseVolume';
import { IncreaseVolumeButton } from '@pages/game/UserInterface/buttons/IncreaseVolume';
import {
  BULLET_STATE,
  CONSOLE_MODE,
  FRAME,
  FROG_RADIUS,
  GAME_PHASE,
} from '../constants';
import {
  getBulletState,
  getConsoleMode,
  getCurrentLevel,
  getFullscreenState,
  getGamePhase,
} from '../selectors';

export const UserInterface: FC = () => {
  const resetCombo = useAction(gameActions.resetCombo);
  const setBulletState = useAction(gameActions.setBulletState);
  const setShotPath = useAction(gameActions.setShotPath);
  const setFullscreenState = useAction(gameActions.setFullscreenState);
  const setConsoleMode = useAction(gameActions.setConsoleMode);
  const setGamePhase = useAction(gameActions.setGamePhase);

  const bulletState = useSelector(getBulletState);
  const level = useSelector(getCurrentLevel);
  const gamePhase = useSelector(getGamePhase);
  const fullscreenState = useSelector(getFullscreenState);
  const consoleMode = useSelector(getConsoleMode);

  const screenRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState(1);
  const [angle, setAngle] = useState(0);

  const performanceRef = useRef(performance.now());
  const mouseTimeoutRef = useRef(0);
  const angleRef = useRef(0);
  const keyboardTimeoutRef = useRef(0);

  const ballsPath = useMemo(
    () => getPath(levels[level].start, levels[level].curve),
    []
  );

  const calculateShotPath = () => {
    // рассчитываем путь
    const path: number[][] = [];
    const shotAngle = angle;
    for (
      let i = FROG_RADIUS + BULLET_TICK_DISTANCE;
      i < FRAME.WIDTH;
      i += BULLET_TICK_DISTANCE
    ) {
      const x = Math.round(
        levels[level].frogPosition.x + i * Math.cos(shotAngle)
      );
      const y = Math.round(
        levels[level].frogPosition.y + i * Math.sin(shotAngle)
      );
      if (x >= 0 && x < FRAME.WIDTH && y >= 0 && y < FRAME.HEIGHT) {
        path.push([x, y, shotAngle]);
      }
    }
    setShotPath(path);
  };

  const mouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      gamePhase === GAME_PHASE.LOADING ||
      gamePhase === GAME_PHASE.PAUSED ||
      gamePhase === GAME_PHASE.EXITING ||
      !boxRef.current
    ) {
      return;
    }

    const rect = boxRef.current.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    const frogX = x - levels[level].frogPosition.x * ratio;
    const frogY = y - levels[level].frogPosition.y * ratio;
    angleRef.current = Math.atan2(frogY, frogX);

    const delta = performance.now() - performanceRef.current;
    performanceRef.current = performance.now();

    if (delta >= fps(DEFAULT_FRAMERATE)) {
      setAngle(angleRef.current);
    } else {
      if (mouseTimeoutRef.current) {
        return;
      }
      mouseTimeoutRef.current = window.setTimeout(() => {
        setAngle(angleRef.current);
        mouseTimeoutRef.current = 0;
      }, fps(DEFAULT_FRAMERATE) - delta);
    }
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED || gamePhase === GAME_PHASE.PAUSED) {
      return;
    }
    calculateShotPath();
    resetCombo();
    setBulletState(BULLET_STATE.SHOT);
  };

  const mouseRightClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (bulletState !== BULLET_STATE.ARMED || gamePhase === GAME_PHASE.PAUSED) {
      return;
    }
    setBulletState(BULLET_STATE.ARMING);
  };

  const onFullScreenChange = () => {
    setFullscreenState(!!document.fullscreenElement);
  };

  const onResize = () => {
    if (!screenRef.current) {
      return;
    }
    if (document.fullscreenElement) {
      const width = screenRef.current.clientWidth;
      const height = screenRef.current.clientHeight;
      if (height / FRAME.HEIGHT < width / FRAME.WIDTH) {
        setRatio(height / FRAME.HEIGHT);
      } else {
        setRatio(width / FRAME.WIDTH);
      }
      return;
    }
    setRatio(1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (keyboardTimeoutRef.current) {
      return;
    }
    keyboardTimeoutRef.current = window.setTimeout(() => {
      keyboardTimeoutRef.current = 0;
    }, 500);
    const keyName = event.key;
    switch (keyName) {
      case keyName.match(/^[Hh]$/)?.input:
        setConsoleMode(
          consoleMode === CONSOLE_MODE.HELP
            ? CONSOLE_MODE.HIDDEN
            : CONSOLE_MODE.HELP
        );
        break;

      case keyName.match(/^[Ss]$/)?.input:
        setConsoleMode(
          consoleMode === CONSOLE_MODE.STAT
            ? CONSOLE_MODE.HIDDEN
            : CONSOLE_MODE.STAT
        );
        break;

      case 'Escape':
        setConsoleMode(CONSOLE_MODE.HIDDEN);
        break;

      case keyName.match(/^[Ff]$/)?.input:
        setFullscreenState(!fullscreenState);
        break;

      case ' ':
        if (bulletState !== BULLET_STATE.ARMED) return;
        setGamePhase(
          gamePhase === GAME_PHASE.PAUSED
            ? GAME_PHASE.STARTED
            : GAME_PHASE.PAUSED
        );
        break;
    }
  };

  useEffect(() => {
    if (!screenRef.current || !boxRef.current) {
      return;
    }
    boxRef.current.style.width = `${FRAME.WIDTH * ratio}px`;
    boxRef.current.style.height = `${FRAME.HEIGHT * ratio}px`;
  }, [ratio]);

  useEffect(() => {
    if (!screenRef.current) {
      return;
    }
    if (fullscreenState && !document.fullscreenElement) {
      screenRef.current.requestFullscreen();
    }
    if (!fullscreenState && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullscreenState]);

  // init
  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullScreenChange);
    window.addEventListener('resize', onResize);
    boxRef.current?.focus();
    return () => {
      clearTimeout(mouseTimeoutRef.current);
      clearTimeout(keyboardTimeoutRef.current);
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={screenRef}>
      <div
        ref={boxRef}
        onMouseMove={mouseMove}
        onClick={mouseClick}
        onContextMenu={mouseRightClick}
        onKeyDown={onKeyDown}
        tabIndex={0}
        style={{
          position: 'relative',
          margin: 'auto',
          outline: 0,
          width: `${FRAME.WIDTH}px`,
          height: `${FRAME.HEIGHT}px`,
        }}
      >
        <BackLayer />
        <BallsLayer ballsPath={ballsPath} />
        <SkullLayer />
        <BulletLayer />
        <FrogLayer angle={angle} />
        <EffectsLayer ballsPath={ballsPath} />
        <ComboLayer />
        <ScoreLayer />
        <ButtonsLayer />
        <BlackoutLayer />
        <TitleLayer />
        <InfoLayer />
        <PauseButton ratio={ratio} x={FRAME.WIDTH - 105} y={10} />
        <FullscreenButton ratio={ratio} x={FRAME.WIDTH - 65} y={25} />
        <IncreaseVolumeButton ratio={ratio} x={FRAME.WIDTH - 50} y={60} />
        <DecreaseVolumeButton ratio={ratio} x={FRAME.WIDTH - 50} y={95} />
        <MuteButton ratio={ratio} x={FRAME.WIDTH - 50} y={130} />
      </div>
    </div>
  );
};
