// Модуль отображает шары

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BALL_DIAMETER, BALL_RADIUS, BULLET_STATE, FRAME, GAME_PHASE, GAME_RESULT } from '../constants';
import { ALLOWANCE, BALL_EXPLODE_TIMEOUT, GAME_PHASE_TIMEOUTS } from '../setup';
import { getBulletColor, getCombo, getCurrentLevel, getGamePhase, getShotPath, getShotPosition } from '../selectors';
import { gameActions } from '../reducer';
import { applyPhysic, calculateRemainColors, createBalls, findSame } from './utils/balls';
import Ball from '../lib/ball';
import levels from '../levels';
import { getCloserPoint, getLineLen } from '../lib/geometry';
import { fps } from '../lib/utils';

interface Props {
  ballsPath: number[][];
}

export const BallsLayer: FC<Props> = ({ ballsPath }) => {
  const dispatch = useDispatch();

  const gamePhase = useSelector(getGamePhase);
  const level = useSelector(getCurrentLevel);
  const shotPosition = useSelector(getShotPosition);
  const combo = useSelector(getCombo);
  const bulletColor = useSelector(getBulletColor);
  const shotPath = useSelector(getShotPath);

  const balls = useMemo<Ball[]>(() => {
    return createBalls(level);
  }, []);

  const inserting = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pusherIncrement = useRef(0);
  const timeoutRef = React.useRef<number>();
  const requestRef = React.useRef<number>();

  const pusherStartPosition = -levels[level].balls * BALL_DIAMETER;

  const [pusher, setPusher] = useState(pusherStartPosition);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !balls) {
      return;
    }

    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    let ballsRemain = 0;
    balls.forEach((ball) => {
      if (ball.position < 0 || ball.position >= ballsPath.length - 1) {
        return;
      }
      ballsRemain += 1;
      ball.update(ball.position + ball.rotationOffset, ballsPath[ball.position][2]);
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10;
      ctx.drawImage(ball.canvas,
        ballsPath[ball.position][0] - BALL_RADIUS,
        ballsPath[ball.position][1] - BALL_RADIUS);
    });

    if (ballsRemain === 0 && gamePhase === GAME_PHASE.ENDING) {
      // шаров не осталось, выходим
      dispatch(gameActions.setGamePhase(GAME_PHASE.ENDED));
    }
  };

  const explode = (sameBalls: number[]) => {
    const positions = sameBalls.reduce((memo: number[], index) => [...memo, balls[index].position], []);
    dispatch(gameActions.setExplosion(positions));
    balls.splice(sameBalls[0], sameBalls.length);
  };

  const explodeSameBalls = (balls: Ball[], ballIndex: number, timeout: number) => {
    const sameBalls = findSame(balls, ballIndex);
    if (sameBalls.length >= 3) {
      let score = sameBalls.length - 1 + Math.pow(sameBalls.length - 2, 2);
      score *= combo + 1;
      dispatch(gameActions.increaseScore(score));
      dispatch(gameActions.increaseCombo());
      timeoutRef.current = window.setTimeout(() => explode(sameBalls), timeout);
    }
  };

  // рассчитывает полжения шаров относительно pusher
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || gamePhase === GAME_PHASE.ENDED) {
      return;
    }
    // шары кончились, победа
    if (!balls.length && gamePhase === GAME_PHASE.STARTED) {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
      dispatch(gameActions.setGamePhase(GAME_PHASE.ENDING));
      timeoutRef.current = window.setTimeout(() => dispatch(gameActions.setGamePhase(GAME_PHASE.ENDED)), GAME_PHASE_TIMEOUTS.ENDING);
      window.requestAnimationFrame(() => draw());
      return;
    }
    if (gamePhase !== GAME_PHASE.ENDING && pusherIncrement.current > 1) {
      pusherIncrement.current -= 1;
    }

    // рассчитываем положение шаров
    const result = applyPhysic(pusher);

    // если передний шар добрался до черепа
    if (gamePhase === GAME_PHASE.STARTED && balls[balls.length - 1].position >= ballsPath.length - 1) {
      // быстро сливаем оставшиеся шары
      pusherIncrement.current = 28;
      dispatch(gameActions.setGameResult(GAME_RESULT.FAIL));
      dispatch(gameActions.setGamePhase(GAME_PHASE.ENDING));
    }

    // взрываем
    result.impacts.forEach((i) => {
      explodeSameBalls(balls, i, BALL_EXPLODE_TIMEOUT);
    });
    window.requestAnimationFrame(() => draw());

    if (gamePhase !== GAME_PHASE.ENDED && gamePhase !== GAME_PHASE.EXITING) {
      timeoutRef.current = window.setTimeout(() => {
        setPusher(pusher + pusherIncrement.current + result.pusherOffset);
      }, fps(levels[level].speed));
    }
  }, [pusher]);

  // запускает и останавливает pusher
  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTED) {
      pusherIncrement.current = levels[level].rollOut;
      setPusher(pusher + 1);
    }
    if (gamePhase === GAME_PHASE.ENDING) {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
    }
  }, [gamePhase]);

  // полет пули. Проверятся дистанция до каждого шара
  useEffect(() => {
    if (!shotPath.length || shotPosition >= shotPath.length) { return; }
    const x = shotPath[shotPosition][0];
    const y = shotPath[shotPosition][1];
    balls.forEach((ball, index) => {
      if (ball.position < 0 || ball.position >= ballsPath.length || inserting.current) {
        return;
      }
      const distance = getLineLen(
        x, y,
        ballsPath[ball.position][0], ballsPath[ball.position][1]
      );
      // проверка на попадание c допуском
      if (distance < BALL_RADIUS + ALLOWANCE) {
        // выставляем флаг, чтобы следующая итерация
        // не начала вставлять шар повторно
        inserting.current = true;
        dispatch(gameActions.setBulletState(BULLET_STATE.INSERTING));

        // рассчитываем, всталять перед шаром, в который попали или после
        const closerPoint = getCloserPoint(ballsPath, x, y);
        const insertedIndex = closerPoint > ball.position ? index + 1 : index;
        // вставляем
        balls.splice(insertedIndex, 0, new Ball(bulletColor));
        balls[insertedIndex].position = closerPoint;

        // убираем с глаз пулю и обнуляем путь выстрела
        dispatch(gameActions.setShotPath([]));

        explodeSameBalls(balls, insertedIndex, BALL_EXPLODE_TIMEOUT);

        const remainColors = calculateRemainColors(balls, insertedIndex);
        dispatch(gameActions.setRemainColors(remainColors));

        timeoutRef.current = window.setTimeout(() => {
          dispatch(gameActions.setBulletState(BULLET_STATE.ARMING));
          inserting.current = false;
        }, 100);
      }
    });
  }, [shotPosition]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Balls canvas not found');
    }

    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    setPusher(pusher + pusherIncrement.current);

    return () => {
      setPusher(pusherStartPosition);
      clearTimeout(timeoutRef.current);
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
