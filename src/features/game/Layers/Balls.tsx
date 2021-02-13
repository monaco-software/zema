/** eslint prefer-const: "error" */
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ALLOWANCE, BALL_RADIUS, BULLET_STATE, FRAME, GAME_PHASE, GAME_PHASE_TIMEOUTS, GAME_RESULT } from '../constants';
import { gameActions } from '../reducer';
import { getCurrentLevel, getGamePhase, getShotPosition } from '../selectors';

import '../assets/styles/Layer.css';
import { applyPhysic, calculateRemainColors, createBalls, findSame } from './utils/Balls';
import Ball from '../lib/ball';
import levels from '../levels';
import { getCloserPoint, getLineLen } from '../lib/geometry';
import bulletObject from '../lib/bullet';

interface Props {
  ballsPath: number[][];
}

export const BallsLayer: FC<Props> = ({ ballsPath }) => {
  const dispatch = useDispatch();

  const gamePhase = useSelector(getGamePhase);
  const level = useSelector(getCurrentLevel);
  const shotPosition = useSelector(getShotPosition);

  const balls = useMemo<Ball[]>(() => createBalls(level), []);

  const bullet = useRef(bulletObject);
  const inserting = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pusherIncrement = useRef(0);
  const pusherStartPosition = -levels[level].balls * BALL_RADIUS * 2;

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
      ball.update(ball.position + ball.positionOffset, ballsPath[ball.position][2]);
      ctx.shadowColor = 'black';
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
      setTimeout(() => explode(sameBalls), timeout);
    }
  };

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || gamePhase === GAME_PHASE.ENDED) {
      return;
    }
    // шары кончились, победа
    if (!balls.length && gamePhase === GAME_PHASE.STARTED) {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
      dispatch(gameActions.setGamePhase(GAME_PHASE.ENDING));
      setTimeout(() => dispatch(gameActions.setGamePhase(GAME_PHASE.ENDED)), GAME_PHASE_TIMEOUTS.ENDING);
      window.requestAnimationFrame(() => draw());
      return;
    }
    if (gamePhase !== GAME_PHASE.ENDING && pusherIncrement.current > 1) {
      pusherIncrement.current -= 1;
    }

    // рассчитываеи положение шаров
    const result = applyPhysic(balls, pusher);

    // проверяем, не добрался ли передний шар до черепа
    if (gamePhase === GAME_PHASE.STARTED && balls[balls.length - 1].position >= ballsPath.length - 1) {
      pusherIncrement.current = 15;
      dispatch(gameActions.setGameResult(GAME_RESULT.FAIL));
      dispatch(gameActions.setGamePhase(GAME_PHASE.ENDING));
    }

    // взрываем
    result.impacts.forEach((i) => {
      explodeSameBalls(balls, i, 400);
    });
    window.requestAnimationFrame(() => draw());

    if (gamePhase !== GAME_PHASE.ENDED && gamePhase !== GAME_PHASE.EXITING) {
      setTimeout(() => {
        setPusher(pusher + pusherIncrement.current + result.pusherOffset);
      }, 1000 * (1 / levels[level].speed));
    }
  }, [pusher]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTED) {
      pusherIncrement.current = levels[level].rollOut;
      setPusher(pusher + 1);
    }
    if (gamePhase === GAME_PHASE.ENDING) {
      dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
    }
  }, [gamePhase]);

  // полет пули. На каждую позицию проверятся дистанция до каждого шара
  useEffect(() => {
    balls.forEach((ball, index) => {
      if (ball.position < 0 || ball.position >= ballsPath.length || inserting.current) {
        return;
      }
      const distance = getLineLen(
        shotPosition[0], shotPosition[1],
        ballsPath[ball.position][0], ballsPath[ball.position][1]
      );
      // проверка на попадание c допуском
      if (distance < BALL_RADIUS + ALLOWANCE) {
        // выставляем флаг, чтобы следующая итерация
        // не начала вставлять шар повторно
        inserting.current = true;
        dispatch(gameActions.setBulletState(BULLET_STATE.INSERTING));

        // рассчитываем, всталять перед шаром, в который попали или после
        const closerPoint = getCloserPoint(ballsPath, shotPosition[0], shotPosition[1]);
        const insertedIndex = closerPoint > ball.position ? index + 1 : index;
        // вставляем
        balls.splice(insertedIndex, 0, new Ball(bullet.current.color));
        balls[insertedIndex].position = closerPoint;

        explodeSameBalls(balls, insertedIndex, 400);
        dispatch(gameActions.setShotPosition([-BALL_RADIUS, -BALL_RADIUS]));
        dispatch(gameActions.setShotPath([]));

        const remainColors = calculateRemainColors(balls, insertedIndex);
        dispatch(gameActions.setRemainColors(remainColors));

        setTimeout(() => {
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
    };
  }, []);

  return (
    <canvas className="Layer"
      ref={canvasRef} />
  );
};
