/** eslint prefer-const: "error" */

import React, { FC, useEffect } from 'react';
import levels from '../levels';
import {
  ALLOWANCE,
  BALL_DIAMETER,
  BALL_RADIUS,
  BULLET_SPEED,
  BULLET_START_POSITION,
  BULLET_STATE,
  FRAME,
  FROG_RADIUS,
  SKULL_RADIUS,
} from '../constants';
import { getCloserPoint, getLineLen, getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import skullImage from '../assets/images/skull.png';
import { gameActions } from '../reducer';
import { useDispatch } from 'react-redux';
import Explosion from '../lib/explosion';

import { random } from '../lib/utils';
import { ROUTES } from '../../../common/constants';
import { store } from '../../../store/store';
import Particle from '../lib/paricle';
import bulletOBJ from '../lib/bullet';

import '../assets/styles/Layer.css';

export const BallsLayer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  let bullet = { ...store.getState().game.bullet };

  const level = store.getState().game.currentLevel;
  const levelData = levels[level];

  const bulletPath: number[][] = [];
  const bulletBall = new Ball(random(levelData.ballsTypes));
  let bulletPosition = 0;
  let shotLoop = 0;
  let ballsPusherLoop = 0;

  const skull = new Image();

  const ballCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let ballsPath: number[][];
  let balls: Ball[] = [];
  let pusherPosition = -levelData.balls * BALL_DIAMETER;
  let speed = 500;

  let win = true;
  let ended = false;
  let inserting = false;
  let skullAngle = 0;
  let skullRotateAngle = 0;
  const explosed: Explosion[] = [];
  let deleteBall = false;

  const drawBalls = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
      if (ball.position < 0) {
        return;
      }
      ball.update(ball.position + ball.positionOffset, ballsPath[ball.position][2]);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      ctx.drawImage(ball.canvas, ballsPath[ball.position][0] - BALL_RADIUS, ballsPath[ball.position][1] - BALL_RADIUS, BALL_DIAMETER, BALL_DIAMETER);
    });
    if (skullAngle !== 0) {
      ctx.translate(levelData.skullPosition.x + SKULL_RADIUS, levelData.skullPosition.y + SKULL_RADIUS);
      ctx.rotate(skullAngle);
      ctx.translate(-SKULL_RADIUS, -SKULL_RADIUS);
      ctx.drawImage(skull, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(skull, levelData.skullPosition.x, levelData.skullPosition.y);
    }

    if (bulletPath.length) {
      bulletBall.update(bulletPosition, bulletPath[bulletPosition][2]);
      ctx.drawImage(
        bulletBall.canvas,
        bulletPath[bulletPosition][0] - BALL_RADIUS,
        bulletPath[bulletPosition][1] - BALL_RADIUS,
        BALL_DIAMETER, BALL_DIAMETER);
    }

    explosed.forEach((boom, index) => {
      if (boom.phase < boom.numberOfFrames) {
        boom.update(boom.phase);
        boom.phase += 1;
        ctx.drawImage(boom.canvas, boom.x - BALL_RADIUS, boom.y - BALL_RADIUS, BALL_DIAMETER, BALL_DIAMETER);
      } else {
        explosed.splice(index, 1);
      }
    });
  };
  const getRemainColor = (array: Ball[]) => {
    const remainColors: number[] = [];
    array.forEach((ball) => {
      if (!remainColors.includes(ball.color)) {
        remainColors.push(ball.color);
      }
    });
    console.log(remainColors);
    const randomColorIndex = random(remainColors.length);
    console.log(randomColorIndex);
    return remainColors[randomColorIndex];
  };

  const letArming = () => {
    bulletPath.length = 0;
    bulletBall.positionOffset = random(60);
    const state = store.getState().game.bullet.state;
    if (state === BULLET_STATE.SHOT || state === BULLET_STATE.ARMING) {
      const color = getRemainColor(balls);
      dispatch(gameActions.setBullet({
        state: BULLET_STATE.ARMING,
        color: color,
        angle: 0,
        position: BULLET_START_POSITION,
      }));
      bulletOBJ.color = color;
    }
    clearInterval(shotLoop);
  };

  // возвращает массив индексов одинаковых шариков рядом с заданным
  const findSame = (index: number): number[] => {
    const res = [];
    const color = balls[index].color;
    let fail = false;
    for (let f = index; f < balls.length; f += 1) {
      if (balls[f].color === color && !fail) {
        res.push(f);
      } else {
        fail = true;
      }
    }
    fail = false;
    for (let b = index; b >= 0; b -= 1) {
      if (balls[b].color === color && !fail) {
        res.push(b);
      } else {
        fail = true;
      }
    }
    return [...new Set(res.sort((n1, n2) => n1 - n2))];
  };

  const shine = () => {
    for (let i = 0; i < ballsPath.length; i += BALL_DIAMETER) {
      setTimeout(() =>
        explosed.push(new Particle(ballsPath[i][0], ballsPath[i][1])),
      Math.floor(i / 3));
    }
  };

  const explode = (explodeBalls: number[]) => {
    explodeBalls.forEach((ball, index) => {
      const pathPosition = ballsPath[balls[ball].position];
      if (pathPosition) { // шар не за экраном
        setTimeout(() =>
          explosed.push(new Explosion(pathPosition[0], pathPosition[1])),
        (explodeBalls.length - index) * 20);
      }
    });
    balls.splice(explodeBalls[0], explodeBalls.length);
  };

  const explodeSameBalls = (ballIndex: number, timeout: number) => {
    const sameBalls = findSame(ballIndex);
    if (sameBalls.length >= 3) {
      // делаем копию, чтобы сразу выставить значение по цветам оставшихся шаров
      const ballsCopy = balls.slice();
      ballsCopy.splice(sameBalls[0], sameBalls.length);
      setTimeout(() => explode(sameBalls), timeout);
    }
  };

  const pushBullet = () => {
    if (bulletPath.length && !inserting && !ended) {
      if (bulletPosition >= bulletPath.length - 1) { // промахнулись
        letArming();
      } else {
        balls.forEach((ball, index) => {
          if (inserting || ball.position < 0) {
            return;
          }
          const bulletXY = { x: bulletPath[bulletPosition][0], y: bulletPath[bulletPosition][1] };
          const distance = getLineLen(
            bulletXY.x, bulletXY.y,
            ballsPath[ball.position][0], ballsPath[ball.position][1]
          );
          // проверка на попадание c допуском
          if (distance < BALL_RADIUS + ALLOWANCE) {
            // вставка шара. Запускаем один раз
            if (!inserting) {
              inserting = true;
              // рассчитываем, всталять перед шаром, в который попали или после
              const closerPoint = getCloserPoint(ballsPath, bulletXY.x, bulletXY.y);
              const insertedIndex = closerPoint > ball.position ? index + 1 : index;
              balls.splice(insertedIndex, 0, new Ball(bulletBall.color));
              balls[insertedIndex].position = closerPoint;
              explodeSameBalls(insertedIndex, 400);
              letArming();
            }
          }
        });
        bulletPosition += 1;
      }
    }
    requestAnimationFrame(() => drawBalls());
  };

  // начало выстрела
  const makeShot = () => {
    const newValue = store.getState().game.bullet;
    if (newValue.state === bullet.state) {
      return;
    }
    bullet = Object.assign(bullet, newValue);
    if (newValue.state === BULLET_STATE.SHOT) {
      bulletBall.setColor(newValue.color);
      bulletPosition = 0;
      inserting = false;
      // рассчитываем путь
      for (let i = FROG_RADIUS; i < FRAME.WIDTH; i += BULLET_SPEED) {
        const x = Math.round(levelData.frogPosition.x + i * Math.cos(bullet.angle));
        const y = Math.round(levelData.frogPosition.y + i * Math.sin(bullet.angle));
        if (x >= 0 && x <= FRAME.WIDTH && y >= 0 && y <= FRAME.HEIGHT) {
          bulletPath.push([x, y, bullet.angle]);
        }
      }
      shotLoop = window.setInterval(pushBullet, 20);
    }
  };

  const unsubscribe = store.subscribe(makeShot);

  let initBalls = () => {
    balls = [];
    for (let i = 0; i < levelData.balls; i += 1) {
      const ball = new Ball(random(levelData.ballsTypes));
      ball.position = pusherPosition + i * BALL_DIAMETER;
      balls.push(ball);
    }
  };

  const pushBalls = () => {
    // шары кончились. запускаем один раз
    if (!balls.length && !ended) {
      ended = true;
      if (win) {
        shine();
      }
      dispatch(gameActions.setBullet({ state: BULLET_STATE.IDLE, color: 0, angle: 0, position: BULLET_START_POSITION }));
      setTimeout(() => {
        clearInterval(ballsPusherLoop);
        if (win) {
          alert('You win!)');
          history.push(ROUTES.GAME_LEVELS);
        } else {
          alert('You are a loser');
          history.push(ROUTES.GAME_OVER);
        }
      }, 2000);
      return;
    }

    pusherPosition += 1;

    balls.forEach((ball, ballIndex) => {
      if (ballIndex === 0) {
        if (ball.position <= pusherPosition) {
          ball.position = pusherPosition;
        }
        if (ball.position > pusherPosition) {
          // толкатель догоняет шары из любой позицци за одинаковое количество тиков
          const pusherDistance = ball.position - pusherPosition;
          pusherPosition += pusherDistance >= 4 ? pusherDistance : 1;
        }
      } else {
        const prevBallPosition = balls[ballIndex - 1].position;
        const prevBallDistance = ball.position - prevBallPosition;
        // признак того, что был вставлен шар
        const inserting = prevBallDistance <= BALL_RADIUS;
        // сдвигаем шар до тех пор, пока он не перестанет наезжать на соседний
        while (ball.position < prevBallPosition + BALL_DIAMETER - 1) {
          ball.position += 1;
          if (inserting) {
            // перемещаем не прокручивая
            ball.positionOffset -= 1;
          }
        }
        if (prevBallDistance > BALL_DIAMETER) {
          ball.acceleration += 1;
          for (let i = ballIndex; i < balls.length; i += 1) {
            balls[i].position -= ball.acceleration > BALL_DIAMETER ? BALL_DIAMETER : ball.acceleration;
          }
        } else {
          // чем сильнее разгон, тем дальше отлетают шары
          const moveDistance = Math.floor(Math.pow(ball.acceleration / 4, 3));
          if (ball.acceleration && moveDistance) {
            pusherPosition -= moveDistance + 5;
            for (let i = 0; i < balls.length; i += 1) {
              balls[i].position -= moveDistance;
            }
            ball.acceleration = 0;
            explodeSameBalls(ballIndex, 300);
          }
        }
      }

      // проигрыш
      if (ball.position >= ballsPath.length) {
        if (win) {
          dispatch(gameActions.setBulletState(BULLET_STATE.IDLE));
          win = false;
          skullRotateAngle = Math.PI * 2 / balls.length;
        }
        deleteBall = true;
        // быстро сливаем шары
        pusherPosition += BALL_DIAMETER - 2;
        // делаем один оборот черепа
        skullAngle < Math.PI * 2 ? skullAngle += skullRotateAngle : skullAngle = Math.PI * 2;
      }
    });
    if (deleteBall) {
      deleteBall = false;
      balls.pop();
    }
    requestAnimationFrame(() => drawBalls());
  };

  const fastForward = () => {
    if (speed >= levelData.speed) {
      speed -= 1;
      pushBalls();
      setTimeout(() => fastForward(), 1000 * (1 / speed));
    } else {
      dispatch(gameActions.setBulletState(BULLET_STATE.ARMING));
      letArming();
    }
  };

  useEffect(() => {
    canvas = ballCanvasRef.current as HTMLCanvasElement;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ballsPath = getPath(levelData.start, levelData.curve);
    initBalls();
    ballsPusherLoop = window.setInterval(pushBalls, 1000 * (1 / levelData.speed));
    skull.src = skullImage;
    skull.onload = () => {
      ctx.drawImage(skull, levelData.skullPosition.x, levelData.skullPosition.y);
      fastForward();
    };
    return () => {
      clearInterval(ballsPusherLoop);
      clearInterval(shotLoop);
      unsubscribe();
    };
  }, []);

  return (
    <canvas className="Layer"
      ref={ballCanvasRef} />
  );
};
