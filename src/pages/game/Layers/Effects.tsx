// Модуль отображает взрывы и частицы

import Particle from '../lib/paricle';
import Explosion from '../lib/explosion';
import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { fps, random } from '../lib/utils';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { BALL_EXPLODE_GAP, DEFAULT_FRAMERATE } from '../setup';
import { getExplosion, getGamePhase, getGameResult } from '../selectors';
import {
  BALL_DIAMETER,
  BALL_RADIUS,
  FRAME,
  GAME_PHASE,
  GAME_RESULT,
} from '../constants';

type Effect = Explosion | Particle;

interface Props {
  ballsPath: number[][];
}

export const EffectsLayer: FC<Props> = ({ ballsPath }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const effects = useRef<Effect[]>([]);
  const gamePhase = useSelector(getGamePhase);
  const gameResult = useSelector(getGameResult);
  const explosion = useSelector(getExplosion);

  const drawn = useRef(false);
  const effectTimeoutRef = useRef<number[]>([]);
  const drawTimeoutRef = useRef<number>();
  const requestRef = useRef<number>();
  const deletedEffects = useRef<Effect[][]>([]);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    // рисуем взрывы и частицы
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 15;

    effects.current.forEach((effect, index) => {
      if (effect.phase < effect.numberOfFrames) {
        effect.update(effect.phase);
        effect.phase += 1;
        if (effect instanceof Explosion) {
          ctx.shadowOffsetX = random(10);
          ctx.shadowOffsetY = random(10);
          const sparkExpansion = 50;
          const maxSparkAmount = 10;
          for (let i = 0; i < random(maxSparkAmount); i += 1) {
            ctx.fillRect(
              effect.x + random(sparkExpansion) - random(sparkExpansion),
              effect.y + random(sparkExpansion) - random(sparkExpansion),
              random(3),
              random(3)
            );
          }
        }
        ctx.drawImage(
          effect.canvas,
          effect.x - BALL_RADIUS,
          effect.y - BALL_RADIUS,
          BALL_DIAMETER,
          BALL_DIAMETER
        );
      } else {
        // предотвращает запуск Garbage Collector во время игры
        deletedEffects.current.push(effects.current.splice(index, 1));
      }
    });
    if (effects.current.length) {
      drawn.current = true;
      effectTimeoutRef.current.push(
        window.setTimeout(
          () => (requestRef.current = window.requestAnimationFrame(draw)),
          fps(DEFAULT_FRAMERATE)
        )
      );
    } else {
      drawn.current = false;
    }
  };

  const runParticles = () => {
    for (let i = 0; i < ballsPath.length; i += BALL_DIAMETER) {
      effectTimeoutRef.current.push(
        window.setTimeout(
          () =>
            effects.current.push(
              new Particle(ballsPath[i][0], ballsPath[i][1])
            ),
          Math.floor(i / 2)
        )
      );
    }
    drawTimeoutRef.current = window.setTimeout(() => {
      requestRef.current = window.requestAnimationFrame(draw);
    }, fps(DEFAULT_FRAMERATE));
  };

  const runFirework = () => {
    for (let i = 0; i < 150; i += 1) {
      effectTimeoutRef.current.push(
        window.setTimeout(
          () =>
            effects.current.push(
              new Particle(random(FRAME.WIDTH), random(FRAME.HEIGHT))
            ),
          i * 15
        )
      );
    }
    drawTimeoutRef.current = window.setTimeout(() => {
      requestRef.current = window.requestAnimationFrame(draw);
    }, fps(DEFAULT_FRAMERATE));
  };

  useEffect(() => {
    if (!explosion.length) {
      return;
    }
    playSound(SOUNDS.BOOM);
    explosion
      .slice()
      .reverse()
      .forEach((exp: number, index: number) => {
        if (exp < 0 || exp >= ballsPath.length) {
          return;
        }
        effectTimeoutRef.current.push(
          window.setTimeout(() => {
            effects.current.push(
              new Explosion(ballsPath[exp][0], ballsPath[exp][1])
            );
          }, index * BALL_EXPLODE_GAP)
        );
      });
    if (!drawn.current) {
      drawTimeoutRef.current = window.setTimeout(
        () => (requestRef.current = window.requestAnimationFrame(draw)),
        fps(DEFAULT_FRAMERATE)
      );
    }
  }, [explosion]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTING) {
      runParticles();
      playSound(SOUNDS.STARTING);
    }
    if (gamePhase === GAME_PHASE.ENDING && gameResult === GAME_RESULT.WIN) {
      runParticles();
      effectTimeoutRef.current.push(
        window.setTimeout(() => {
          runFirework();
        }, 1800)
      );
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
      deletedEffects.current.length = 0;
      clearTimeout(drawTimeoutRef.current);
      while (effectTimeoutRef.current.length) {
        clearTimeout(effectTimeoutRef.current.pop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <canvas
      style={{ position: 'absolute', height: '100%', width: '100%' }}
      ref={canvasRef}
    />
  );
};
