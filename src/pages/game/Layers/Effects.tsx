// Модуль отображает взрывы и частицы

import Particle from '../lib/paricle';
import Explosion from '../lib/explosion';
import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { fps, random } from '../lib/utils';
import { DEFAULT_FRAMERATE } from '../setup';
import { getExplosion, getGamePhase, getGameResult } from '../selectors';
import { BALL_DIAMETER, BALL_RADIUS, FRAME, GAME_PHASE, GAME_RESULT } from '../constants';

interface Props {
  ballsPath: number[][];
}

export const EffectsLayer: FC<Props> = ({ ballsPath }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const effects = useRef<Explosion[] | Particle[]>([]);
  const gamePhase = useSelector(getGamePhase);
  const gameResult = useSelector(getGameResult);

  const drawn = useRef(false);

  const explosion = useSelector(getExplosion);
  const effectTimeoutRef = useRef<number>();
  const drawTimeoutRef = useRef<number>();
  const requestRef = useRef<number>();

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    // рисуем взрывы и частицы
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 20;

    effects.current.forEach((effect, index) => {
      if (effect.phase < effect.numberOfFrames) {
        effect.update(effect.phase);
        effect.phase += 1;
        ctx.shadowOffsetX = effect instanceof Explosion ? random(15) : 0;
        ctx.shadowOffsetY = effect instanceof Explosion ? random(15) : 0;
        ctx.drawImage(effect.canvas, effect.x - BALL_RADIUS, effect.y - BALL_RADIUS, BALL_DIAMETER, BALL_DIAMETER);
      } else {
        effects.current.splice(index, 1);
      }
    });
    if (effects.current.length) {
      drawn.current = true;
      window.setTimeout(() =>
        requestRef.current = window.requestAnimationFrame(draw), fps(24));
    } else {
      drawn.current = false;
    }
  };

  const runParticles = () => {
    for (let i = 0; i < ballsPath.length; i += BALL_DIAMETER) {
      effectTimeoutRef.current = window.setTimeout(
        () => effects.current.push(new Particle(ballsPath[i][0], ballsPath[i][1])),
        Math.floor(i / 2));
    }
    drawTimeoutRef.current = window.setTimeout(() => {
      requestRef.current = window.requestAnimationFrame(draw), fps(DEFAULT_FRAMERATE);
    });
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !explosion.length) {
      return;
    }
    explosion.slice().reverse().forEach((exp: number, index: number) => {
      if (exp < 0 || exp >= ballsPath.length) {
        return;
      }
      effectTimeoutRef.current = window.setTimeout(
        () => effects.current.push(
          new Explosion(ballsPath[exp][0], ballsPath[exp][1])
        ),
        index * 25);
    });
    if (!drawn.current) {
      drawTimeoutRef.current = window.setTimeout(() =>
        requestRef.current = window.requestAnimationFrame(draw),
      fps(DEFAULT_FRAMERATE));
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

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Effects canvas not found');
    }
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;

    return () => {
      clearTimeout(drawTimeoutRef.current);
      clearTimeout(effectTimeoutRef.current);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      style={{ position: 'absolute' }}
      ref={canvasRef}
    />
  );
};
