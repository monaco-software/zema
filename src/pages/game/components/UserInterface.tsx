// Модуль взаимодействует с пользователем
// слушает мышь и рассчитывает путь пули

import './user-interface.css';
import b_ from 'b_';
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
import { BlackoutLayer } from '../Layers/Blackout';
import { FullscreenButton } from './FullscreenButton';
import { ButtonsLayer } from '@pages/game/Layers/Buttons';
import { MuteButton } from '@pages/game/components/MuteButton';
import { PauseButton } from '@pages/game/components/PauseButton';
import { BULLET_TICK_DISTANCE, DEFAULT_FRAMERATE } from '../setup';
import { BULLET_STATE, FRAME, FROG_RADIUS, GAME_PHASE } from '../constants';
import { DecreaseVolumeButton } from '@pages/game/components/decreaseVolumeButton';
import { IncreaseVolumeButton } from '@pages/game/components/IncreaseVolumeButton';
import { getBulletState, getCurrentLevel, getFullscreenState, getGamePhase } from '../selectors';

const block = b_.lock('user-interface');

export const UserInterface: FC = () => {
  const resetCombo = useAction(gameActions.resetCombo);
  const setBulletState = useAction(gameActions.setBulletState);
  const setShotPath = useAction(gameActions.setShotPath);
  const setFullscreenState = useAction(gameActions.setFullscreenState);

  const bulletState = useSelector(getBulletState);
  const level = useSelector(getCurrentLevel);
  const gamePhase = useSelector(getGamePhase);
  const fullscreenState = useSelector(getFullscreenState);

  const screenRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [ratio, setRatio] = useState(1);
  const [angle, setAngle] = useState(0);

  const performanceRef = useRef(performance.now());
  const mouseTimeoutRef = useRef<number>();
  const angleRef = useRef(0);

  const ballsPath = useMemo(() => getPath(levels[level].start, levels[level].curve), []);

  const calculateShotPath = () => {
    // рассчитываем путь
    const path: number[][] = [];
    const shotAngle = angle;
    for (let i = FROG_RADIUS + BULLET_TICK_DISTANCE; i < FRAME.WIDTH; i += BULLET_TICK_DISTANCE) {
      const x = Math.round(levels[level].frogPosition.x + i * Math.cos(shotAngle));
      const y = Math.round(levels[level].frogPosition.y + i * Math.sin(shotAngle));
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
    ) { return; }

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
      if (mouseTimeoutRef.current) { return; }
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

  const onFullScreenChange = () => {
    setFullscreenState(!!document.fullscreenElement);
  };

  const onResize = () => {
    if (!screenRef.current) { return; }
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

  useEffect(() => {
    if (!screenRef.current || !boxRef.current) { return; }
    boxRef.current.style.width = `${FRAME.WIDTH * ratio}px`;
    boxRef.current.style.height = `${FRAME.HEIGHT * ratio}px`;
  }, [ratio]);

  useEffect(() => {
    if (!screenRef.current) { return; }
    if (fullscreenState && !document.fullscreenElement) {
      screenRef.current.requestFullscreen();
    }
    if (!fullscreenState && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullscreenState]);

  // init
  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullScreenChange );
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div ref={screenRef} className={block()}>
      <div
        ref={boxRef}
        className={block('box')}
        onMouseMove={mouseMove}
        onClick={mouseClick}
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
        <PauseButton
          ratio={ratio}
          x={FRAME.WIDTH - 105}
          y={10}
        />
        <FullscreenButton
          ratio={ratio}
          x={FRAME.WIDTH - 60}
          y={20}
        />
        <MuteButton
          ratio={ratio}
          x={FRAME.WIDTH - 50}
          y={60}
        />
        <IncreaseVolumeButton
          ratio={ratio}
          x={FRAME.WIDTH - 50}
          y={90}
        />
        <DecreaseVolumeButton
          ratio={ratio}
          x={FRAME.WIDTH - 50}
          y={120}
        />
      </div>
    </div>
  );
};
