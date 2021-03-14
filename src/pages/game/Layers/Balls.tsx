// Модуль отображает шары

import Ball from '../lib/ball';
import levels from '../levels';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { fps } from '../lib/utils';
import { gameActions } from '../reducer';
import { useSelector } from 'react-redux';
import { useAction } from '@common/hooks';
import { playSound, SOUNDS } from '@pages/game/lib/sound';
import { getCloserPoint, getLineLen } from '../lib/geometry';
import { ALLOWANCE, BALL_EXPLODE_GAP, BALL_EXPLODE_TIMEOUT } from '../setup';
import { applyPhysic, calculateRemainColors, createBalls, findSame } from './utils/balls';
import { BALL_DIAMETER, BALL_RADIUS, BULLET_STATE, FRAME, GAME_PHASE, GAME_RESULT } from '../constants';
import { getBulletColor, getCombo, getCurrentLevel, getGamePhase, getShotPath, getShotPosition } from '../selectors';

interface Props {
  ballsPath: number[][];
}

export const BallsLayer: FC<Props> = ({ ballsPath }) => {
  const incrementCombo = useAction(gameActions.incrementCombo);
  const increaseScore = useAction(gameActions.increaseScore);
  const setExplosion = useAction(gameActions.setExplosion);
  const setBulletState = useAction(gameActions.setBulletState);
  const setGameResult = useAction(gameActions.setGameResult);
  const setRemainColors = useAction(gameActions.setRemainColors);
  const setShotPath = useAction(gameActions.setShotPath);
  const setGamePhase = useAction(gameActions.setGamePhase);

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
  const exiting = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pusherIncrement = useRef(0);
  const explodeTimeoutRef = useRef<number>();
  const pusherTimeoutRef = useRef<number>();
  const requestRef = useRef<number>();
  const pusherOffset = useRef(0);
  const ballsExploded = useRef(0);

  const pusherStartPosition = -1 * levels[level].balls * BALL_DIAMETER;

  const [pusher, setPusher] = useState(pusherStartPosition);

  const draw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !balls) {
      return;
    }
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;
    ctx.clearRect(0, 0, FRAME.WIDTH, FRAME.HEIGHT);
    const start = performance.now();
    let ballsRendered = 0;
    balls.forEach((ball) => {
      if (ball.position < 0 || ball.position >= ballsPath.length - 1) {
        return;
      }
      ballsRendered += 1;
      const buffer = ball.getBuffer(ball.position + ball.rotationOffset);
      if (!buffer) { return; }
      ctx.translate(
        ballsPath[ball.position][0],
        ballsPath[ball.position][1]
      );
      ctx.rotate(ballsPath[ball.position][2]);
      ctx.drawImage(buffer, -BALL_RADIUS, -BALL_RADIUS);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    });

    const now = performance.now();
    Ball.updates += ballsRendered;
    Ball.updateTime += now - start;
    if (gamePhase !== GAME_PHASE.ENDED && gamePhase !== GAME_PHASE.EXITING) {
      pusherTimeoutRef.current = window.setTimeout(() => {
        setPusher(pusher + pusherIncrement.current + pusherOffset.current);
      }, fps(levels[level].speed));
    }
  };

  const explode = (sameBalls: number[]) => {
    const positions = sameBalls.reduce((memo: number[], index) => [...memo, balls[index].position], []);
    setExplosion(positions);
    balls.splice(sameBalls[0], sameBalls.length);
  };

  const explodeSameBalls = (balls: Ball[], ballIndex: number, timeout: number, needTwoSide = false) => {
    const sameBalls = findSame(balls, ballIndex, needTwoSide);
    if (sameBalls.length >= 3) {
      ballsExploded.current = sameBalls.length;
      let score = Math.pow(sameBalls.length, 2);
      score *= combo + 1;
      increaseScore(score);
      incrementCombo();
      if (combo) {
        playSound(SOUNDS.COMBO);
      }
      explodeTimeoutRef.current = window.setTimeout(() => explode(sameBalls), timeout);
    }
  };

  // рассчитывает положения шаров относительно pusher
  useEffect(() => {
    if (
      gamePhase === GAME_PHASE.PAUSED ||
      gamePhase === GAME_PHASE.ENDED ||
      exiting.current ||
      pusher === pusherStartPosition
    ) { return; }
    // шары кончились, победа
    if (!balls.length && gamePhase === GAME_PHASE.STARTED) {
      setBulletState(BULLET_STATE.IDLE);
      // выставляем таймаут,
      // чтобы успели взорваться шары
      // и флаг exiting для того,
      // чтобы следующие итерации снова не запустили setGamePhase
      exiting.current = true;
      pusherTimeoutRef.current = window.setTimeout(
        () => {
          playSound(SOUNDS.WIN);
          setGameResult(GAME_RESULT.WIN);
          setGamePhase(GAME_PHASE.ENDING);
        },
        BALL_EXPLODE_TIMEOUT + ballsExploded.current * BALL_EXPLODE_GAP);
      requestRef.current = window.requestAnimationFrame(() => draw());
      return;
    }
    // постепенно замедляем шары при начальном выкатывании
    if (gamePhase !== GAME_PHASE.ENDING && pusherIncrement.current > 1) {
      pusherIncrement.current -= 1;
    }

    if (pusher >= ballsPath.length && gamePhase === GAME_PHASE.ENDING) {
      // шаров не осталось, выходим
      setGamePhase(GAME_PHASE.ENDED);
    }

    // рассчитываем положение шаров
    const result = applyPhysic(pusher);

    // если передний шар добрался до черепа
    if (gamePhase === GAME_PHASE.STARTED && balls[balls.length - 1].position >= ballsPath.length - 1) {
      // быстро сливаем оставшиеся шары
      playSound(SOUNDS.LOSE);
      pusherIncrement.current = BALL_DIAMETER;
      setBulletState(BULLET_STATE.IDLE);
      setGameResult(GAME_RESULT.FAIL);
      setGamePhase(GAME_PHASE.ENDING);
    }
    if (result.impacts.length) {
      playSound(SOUNDS.CLASH);
    }
    // взрываем
    result.impacts.forEach((i) => {
      explodeSameBalls(balls, i, BALL_EXPLODE_TIMEOUT, true);
    });
    pusherOffset.current = result.pusherOffset;
    requestRef.current = window.requestAnimationFrame(() => draw());
  }, [pusher]);

  // запускает и останавливает pusher
  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTED) {
      setPusher(pusher + 1);
    }
    if (gamePhase === GAME_PHASE.ENDING) {
      setBulletState(BULLET_STATE.IDLE);
    }
  }, [gamePhase]);

  // полет пули. Проверятся дистанция до каждого шара
  useEffect(() => {
    if (
      !shotPath.length ||
      shotPosition >= shotPath.length ||
      gamePhase === GAME_PHASE.PAUSED
    ) { return; }

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
        setBulletState(BULLET_STATE.INSERTING);
        playSound(SOUNDS.KNOCK);
        // рассчитываем, всталять перед шаром, в который попали или после
        const closerPoint = getCloserPoint(ballsPath, x, y);
        const insertedIndex = closerPoint > ball.position ? index + 1 : index;
        // вставляем
        balls.splice(insertedIndex, 0, new Ball(bulletColor));
        balls[insertedIndex].position = closerPoint;

        // убираем с глаз пулю и обнуляем путь выстрела
        setShotPath([]);

        explodeSameBalls(balls, insertedIndex, BALL_EXPLODE_TIMEOUT);

        const remainColors = calculateRemainColors(balls, insertedIndex);
        setRemainColors(remainColors);
        setBulletState(BULLET_STATE.ARMING);
      }
    });
  }, [shotPosition]);

  useEffect(() => {
    if (gamePhase === GAME_PHASE.STARTED && !shotPath.length) {
      setBulletState(BULLET_STATE.ARMING);
      inserting.current = false;
    }
  }, [shotPath]);

  // init
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      throw new Error('Balls canvas not found');
    }
    pusherIncrement.current = levels[level].rollOut;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;

    return () => {
      setExplosion([]);
      setPusher(pusherStartPosition);
      clearTimeout(pusherTimeoutRef.current);
      clearTimeout(explodeTimeoutRef.current);
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
