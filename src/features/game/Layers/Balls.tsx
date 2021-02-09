import React, { FC, useEffect } from 'react';
import levels from '../levels';
import {
  ALLOWANCE,
  BALL_DIAMETER,
  BALL_RADIUS,
  BULLET_SPEED,
  BULLET_STATE,
  FRAME,
  FROG_RADIUS,
  SKULL_RADIUS,
} from '../constants';
import { getCloserPoint, getLineLen, getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import '../assets/styles/Layer.css';
import skullImage from '../assets/images/skull.png';
import { gameActions } from '../reducer';
import { useDispatch } from 'react-redux';
import Explosion from '../lib/explosion';
import { random } from '../lib/utils';
import { ROUTES } from '../../../common/constants';
import { store } from '../../../store/store';

export const BallsLayer: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  let bullet = { ...store.getState().game.bullet };

  const level = 0; // TODO: get level from state
  const levelData = levels[level];

  const bulletPath: number[][] = [];
  let bulletBall = new Ball(random(levelData.ballsTypes));
  let bulletPosition = 0;
  let shotLoop = 0;
  let ballsPusherLoop = 0;

  let skull = new Image();

  const ballCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let BallsPath: number[][];
  let balls: Ball[] = [];
  let pusherPosition = -levelData.balls * BALL_DIAMETER;

  let speed = 500;
  let win = true;
  let ended = false;
  let inserting = false;
  let skullAngle = 0;
  let skullRotateAngle = 0;
  let explosed: Explosion[] = [];

  const drawBalls = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    balls.forEach((ball) => {
      if (ball.position < 0) {
        return;
      }
      ball.update(ball.position + ball.positionOffset, BallsPath[ball.position][2]);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      ctx.drawImage(ball.canvas, BallsPath[ball.position][0] - BALL_RADIUS, BallsPath[ball.position][1] - BALL_RADIUS, BALL_DIAMETER, BALL_DIAMETER);
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
    if (bulletPath.length) {
      bulletPath.forEach((c) => {
        ctx.fillStyle = '#000';
        ctx.fillRect(c[0], c[1], 1, 1);
      });
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

  const letArming = () => {
    bulletPath.length = 0;
    bulletBall.positionOffset = random(60);
    if (store.getState().game.bullet.state !== BULLET_STATE.IDLE) { // если ира еще не окончена
      dispatch(gameActions.setBullet({ state: BULLET_STATE.ARMING, color: 0, angle: 0 }));
    }
    clearInterval(shotLoop);
  };

  // возвращает массив индексов одинаковых шариков рядом с заданным
  const findSame = (index: number): number[] => {
    let res = [];
    let color = balls[index].color;
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

  const setRemainigColors = (array: Ball[]) => {
    const remainingColors: number[] = [];
    array.forEach((ball) => {
      if (! remainingColors.includes(ball.color)) {
        remainingColors.push(ball.color);
      }
    });
    dispatch(gameActions.setColors(remainingColors));
  };

  const explode = (explodeBalls: number[]) => {
    explodeBalls.forEach((ball) => {
      const pathPosition = BallsPath[balls[ball].position];
      explosed.push(new Explosion( pathPosition[0], pathPosition[1]));
    });
    balls.splice(explodeBalls[0], explodeBalls.length);
  };

  const pushBullet = () => {
    if (bulletPath.length && !inserting && !ended) {
      if (bulletPosition >= bulletPath.length - 1) { // промахнулись
        letArming();
      } else {
        balls.forEach((ball, index) => {
          if (inserting || ball.position < 0) { return; }
          const bullet = { x: bulletPath[bulletPosition][0], y: bulletPath[bulletPosition][1] };
          const distance = getLineLen(
            bullet.x, bullet.y,
            BallsPath[ball.position][0], BallsPath[ball.position][1]
          );
          // проверка на попадание c допуском
          if (distance < BALL_RADIUS + ALLOWANCE) {
            // вставка шара. Запускаем один раз
            if (!inserting) {
              inserting = true;
              // рассчитываем, всталять перед шаром, в который попали или после
              const closerPoint = getCloserPoint(BallsPath, bullet.x, bullet.y);
              const insertedIndex = closerPoint > ball.position ? index + 1 : index;
              balls.splice(insertedIndex, 0, new Ball(bulletBall.color));
              balls[insertedIndex].position = closerPoint;
              const sameBalls = findSame(insertedIndex);
              if (sameBalls.length >= 3) {
                // делаем копию, чтобы сразу выставить значение по цветам оставшихся шаров
                const ballsCopy = balls.slice();
                ballsCopy.splice(sameBalls[0], sameBalls.length);
                setRemainigColors(ballsCopy);
                setTimeout(() => explode(sameBalls), 500);
              }
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
    if (newValue.state === bullet.state) { return; }
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

  const initBalls = () => {
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
      setTimeout(() => {
        clearInterval(ballsPusherLoop);
        if (win) {
          alert('You win!)');
          history.push(ROUTES.GAME_LEVELS);
        } else {
          alert('You are a loser');
          history.push(ROUTES.GAME_OVER);
        }
      }, 1000);
      return;
    }
    pusherPosition += 1;
    let holes = 0;
    balls.forEach((ball, index) => {
      if (index === 0 && ball.position <= pusherPosition) {
        ball.position = pusherPosition;
        return;
      }
      if (index === 0 && ball.position > pusherPosition) {
        ball.position -= 1;
        holes += 1;
        return;
      }
      const prevBallDistance = ball.position - balls[index - 1].position;
      // признак того, что был вставлен шар
      const inserting = prevBallDistance < BALL_RADIUS;
      // сдвигаем шар до тех пор, пока он не перестанет наезжать на соседний
      while (ball.position < balls[index - 1].position + BALL_DIAMETER - 1) {
        if (inserting) {
          // перемещаем не прокручивая
          ball.positionOffset -= 1;
        }
        ball.position += 1;
      }
      if (prevBallDistance > BALL_DIAMETER) {
        holes += 1;
      }
      if (!ended) {
        ball.position -= holes;
      }

      // проигрыш
      if (ball.position >= BallsPath.length) {
        ended = true;
        if (win) {
          win = false;
          skullRotateAngle = Math.PI * 2 / balls.length;
          dispatch(gameActions.setBullet({ state: BULLET_STATE.IDLE, color: 0, angle: 0 }));
        }
        // быстро сливаем шары
        balls.pop();
        pusherPosition += 28;
        // делаем один оборот черепа
        skullAngle < Math.PI * 2 ? skullAngle += skullRotateAngle : skullAngle = Math.PI * 2;
      }
    });
    requestAnimationFrame(() => drawBalls());
  };

  const fastForward = () => {
    if (speed >= levelData.speed) {
      speed -= 1;
      pushBalls();
      setTimeout(() => fastForward(), 1000 * (1 / speed));
    } else {
      dispatch(gameActions.setBullet({ state: BULLET_STATE.ARMING, color: 0, angle: 0 }));
    }
  };

  useEffect(() => {
    canvas = ballCanvasRef.current as HTMLCanvasElement;
    canvas.width = FRAME.WIDTH;
    canvas.height = FRAME.HEIGHT;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    BallsPath = getPath(levelData.start, levelData.curve);
    initBalls();
    setRemainigColors(balls);
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
