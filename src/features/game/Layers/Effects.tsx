/** eslint prefer-const: "error" */
// Модуль отображает взрывы, частицы и летящую пулю

import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BALL_RADIUS, BULLET_STATE, FRAME, GAME_PHASE, GAME_RESULT } from '../constants';
import { getCurrentLevel, getExplosion, getGamePhase, getGameResult, getShotPath, getShotPosition } from '../selectors';
import Explosion from '../lib/explosion';
import Particle from '../lib/paricle';
import Skull from '../lib/skull';
import levels from '../levels';
import bulletObject from '../lib/bullet';
import { gameActions } from '../reducer';

import '../assets/styles/Layer.css';

interface Props {
  ballsPath: number[][];
}

export const EffectsLayer: FC<Props> = ({ ballsPath }) => {
  const dispatch = useDispatch();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const effects = useRef<Explosion[] | Particle[]>([]);
  const gamePhase = useSelector(getGamePhase);
  const level = useSelector(getCurrentLevel);
  const shotPath = useSelector(getShotPath);
  const shotPosition = useSelector(getShotPosition);
  const gameResult = useSelector(getGameResult);

  const drawn = useRef(false);

  const explosion = useSelector(getExplosion);
  const skull = useRef(new Skull());
  const bullet = useRef(bulletObject);

  const drawEffects = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    effects.current.forEach((effect, index) => {
      if (effect.phase < effect.numberOfFrames) {
        effect.update(effect.phase);
        effect.phase += 1;
        ctx.drawImage(effect.canvas, effect.x - BALL_RADIUS, effect.y - BALL_RADIUS, BALL_RADIUS * 2, BALL_RADIUS * 2);
      } else {
        effects.current.splice(index, 1);
      }
    });
    ctx.drawImage(skull.current.image, levels[level].skullPosition.x, levels[level].skullPosition.y);
    if (shotPath.length) {
      shotPath.forEach((p) => {
        ctx.fillStyle = '#f0f';
        ctx.fillRect(p[0], p[1], 1, 1);
      });
      if (bullet.current.position >= shotPath.length) { // промахнулись
        dispatch(gameActions.setShotPath([]));
        dispatch(gameActions.setBulletState(BULLET_STATE.ARMING));
      } else {
        const x = shotPath[bullet.current.position][0];
        const y = shotPath[bullet.current.position][1];
        bullet.current.update(
          bullet.current.position * 3 + bullet.current.positionOffset,
          shotPath[bullet.current.position][2]);
        ctx.drawImage(bullet.current.canvas, x - BALL_RADIUS, y - BALL_RADIUS,
        );
        bullet.current.position += 1;
        dispatch(gameActions.setShotPosition([x, y]));
      }
    }
    if (effects.current.length) {
      drawn.current = true;
      setTimeout(() => window.requestAnimationFrame(drawEffects), 25);
    } else {
      drawn.current = false;
    }
  };

  const runParticles = () => {
    for (let i = 0; i < ballsPath.length; i += BALL_RADIUS * 2) {
      setTimeout(
        () => effects.current.push(new Particle(ballsPath[i][0], ballsPath[i][1])),
        Math.floor(i / 2));
    }
    setTimeout(() => drawEffects(), 1);
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !explosion.length) {
      return;
    }
    explosion.forEach((exp, index) => {
      if (exp < 0 || exp >= ballsPath.length) {
        return;
      }
      setTimeout(
        () => effects.current.push(
          new Explosion(ballsPath[exp][0], ballsPath[exp][1])
        ),
        index * 30);
    });
    if (!drawn.current) {
      setTimeout(() => drawEffects(), 1);
    }
  }, [explosion]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    if (gamePhase === GAME_PHASE.STARTING ||
      gamePhase === GAME_PHASE.ENDING && gameResult === GAME_RESULT.WIN) {
      runParticles();
    }
  }, [gamePhase]);

  useEffect(() => {
    if (shotPath.length) {
      bullet.current.position = 0;
    } else {

    }
    drawEffects();
  }, [shotPath]);

  useEffect(() => {
    setTimeout(() => drawEffects(), 30);
  }, [shotPosition]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Effects canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
  }, []);

  return (
    <canvas className="Layer"
      ref={canvasRef} />
  );
};