// Модуль взаимодействует с пользователем
// слушает мышь и рассчитывает путь пули

import './user-interface.css';

import b_ from 'b_';

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { BULLET_STATE, FRAME, FROG_RADIUS, GAME_PHASE } from '../constants';
import { BULLET_TICK_DISTANCE } from '../setup';
import { gameActions } from '../reducer';
import { getBulletState, getCurrentLevel, getFullscreenState, getGamePhase } from '../selectors';
import levels from '../levels';
import { useAction } from '../../../hooks';
import { FrogLayer } from '../Layers/Frog';
import { BackLayer } from '../Layers/Back';
import { BallsLayer } from '../Layers/Balls';
import { EffectsLayer } from '../Layers/Effects';
import { SkullLayer } from '../Layers/Skull';
import { BulletLayer } from '../Layers/Bullet';
import { ComboLayer } from '../Layers/Combo';
import { ScoreLayer } from '../Layers/Score';
import { BlackoutLayer } from '../Layers/Blackout';
import { TitleLayer } from '../Layers/Title';
import { InfoLayer } from '../Layers/Info';
import { getPath } from '../lib/geometry';
import { FullscreenButton } from './FullscreenButton';

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

  const ballsPath = useMemo(() => getPath(levels[level].start, levels[level].curve), []);

  const calculateShotPath = () => {
    // рассчитываем путь
    const path: number[][] = [];
    const shotAngle = angle;
    for (let i = FROG_RADIUS + BULLET_TICK_DISTANCE; i < FRAME.WIDTH; i += BULLET_TICK_DISTANCE) {
      const x = Math.round(levels[level].frogPosition.x + i * Math.cos(shotAngle));
      const y = Math.round(levels[level].frogPosition.y + i * Math.sin(shotAngle));
      if (x >= 0 && x <= FRAME.WIDTH && y >= 0 && y <= FRAME.HEIGHT) {
        path.push([x, y, shotAngle]);
      }
    }
    setShotPath(path);
  };

  const mouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (gamePhase === GAME_PHASE.LOADING || gamePhase === GAME_PHASE.EXITING) {
      return;
    }
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.pageX - rect.left - levels[level].frogPosition.x * ratio;
    const y = e.pageY - rect.top - levels[level].frogPosition.y * ratio;
    setAngle(Math.atan2(y, x));
  };

  const mouseClick = () => {
    if (bulletState !== BULLET_STATE.ARMED) {
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
    if (!screenRef.current || !boxRef.current) { return; }
    if (document.fullscreenElement) {
      const width = screenRef.current.clientWidth;
      const height = screenRef.current.clientHeight;
      if (height < width) {
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
        <EffectsLayer ballsPath={ballsPath} />
        <SkullLayer />
        <BulletLayer />
        <FrogLayer angle={angle} />
        <ComboLayer />
        <ScoreLayer />
        <BlackoutLayer />
        <TitleLayer />
        <InfoLayer />
        <FullscreenButton
          ratio={ratio}
          top={30}
          right={30}
        />
      </div>
    </div>
  );
};
