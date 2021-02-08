import React, { FC, useEffect } from 'react';
import levels from '../levels';
import {
  allowance,
  ballDiameter,
  ballRadius,
  bulletSpeed,
  bulletStates,
  frame,
  frogRadius,
  skullRadius,
} from '../constants';
import { getCloserPoint, getLineLen, getPath } from '../lib/geometry';
import Ball from '../lib/ball';
import { useHistory } from 'react-router-dom';
import { routes } from '../../../constants';
import '../assets/styles/Layer.css';
import skullImage from '../assets/images/skull.png';
import { store } from '../../../store';
import { bulletActions, remainingColorsActions } from '../reducer';
import { useDispatch } from 'react-redux';
import Explosion from '../lib/explosion';
import { random } from '../lib/utils';

export const BallsLayer: FC = () => {
  const dispatch = useDispatch();

  let bullet = { ...store.getState().bullet };

  const level = 0; // TODO: get level from state
  const levelData = levels[level];

  const bulletPath: number[][] = [];
  let bulletBall = new Ball(random(levelData.ballsTypes));
  let bulletPosition = 0;
  let shotLoop = 0;
  let ballsPushLoop = 0;

  let skull = new Image();

  const history = useHistory();
  const ballCanvasRef = React.createRef<HTMLCanvasElement>();
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let path: number[][];
  let balls: Ball[] = [];
  let pusherPosition = -levelData.balls * ballDiameter;
  pusherPosition = 0;

  let speed = 100;
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
      ball.update(ball.position + ball.positionOffset, path[ball.position][2]);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      ctx.drawImage(ball.canvas, path[ball.position][0] - ballRadius, path[ball.position][1] - ballRadius, ballDiameter, ballDiameter);
    });
    if (skullAngle !== 0) {
      ctx.translate(levelData.skullPosition.x + skullRadius, levelData.skullPosition.y + skullRadius);
      ctx.rotate(skullAngle);
      ctx.translate(-skullRadius, -skullRadius);
      ctx.drawImage(skull, 0, 0);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else {
      ctx.drawImage(skull, levelData.skullPosition.x, levelData.skullPosition.y);
    }

    if (bulletPath.length) {
      bulletBall.update(bulletPosition, bulletPath[bulletPosition][2]);
      ctx.drawImage(
        bulletBall.canvas,
        bulletPath[bulletPosition][0] - ballRadius,
        bulletPath[bulletPosition][1] - ballRadius,
        ballDiameter, ballDiameter);
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
        ctx.drawImage(boom.canvas, boom.x - ballRadius, boom.y - ballRadius, ballDiameter, ballDiameter);
      } else {
        explosed.splice(index, 1);
      }
    });
  };

  const letArming = () => {
    bulletPath.length = 0;
    bulletBall.positionOffset = random(60);
    if (store.getState().bullet.state !== bulletStates.IDLE) { // если ира еще не окончена
      dispatch(bulletActions.setState({ state: bulletStates.ARMING, color: 0, angle: 0 }));
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
    dispatch(remainingColorsActions.setColors(remainingColors));
  };

  const explode = (explodeBalls: number[]) => {
    explodeBalls.forEach((ball) => {
      const pathPosition = path[balls[ball].position];
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
          if (inserting) { return; }
          const bullet = { x: bulletPath[bulletPosition][0], y: bulletPath[bulletPosition][1] };
          // проверка на попадание
          if (getLineLen(
            bullet.x, bullet.y,
            path[ball.position][0], path[ball.position][1]
          ) < ballRadius + allowance) {
            // вставка шара. Запускаем один раз
            if (!inserting) {
              inserting = true;
              // рассчитываем, всталять перед шаром, в который попали или после
              const closerPoint = getCloserPoint(path, bullet.x, bullet.y);
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

  const makeShot = () => {
    const newValue = store.getState().bullet;
    if (newValue.state === bullet.state) { return; }
    bullet = Object.assign(bullet, newValue);
    if (newValue.state === bulletStates.SHOT) {
      bulletBall.setColor(newValue.color);
      bulletPosition = 0;
      for (let i = frogRadius; i < frame.width; i += bulletSpeed) {
        const x = Math.round(levelData.frogPosition.x + i * Math.cos(bullet.angle));
        const y = Math.round(levelData.frogPosition.y + i * Math.sin(bullet.angle));
        if (x >= 0 && x <= frame.width && y >= 0 && y <= frame.height) {
          bulletPath.push([x, y, bullet.angle]);
        }
      }
      inserting = false;
      shotLoop = window.setInterval(pushBullet, 20);
    }
  };
  const unsubscribe = store.subscribe(makeShot);

  const initBalls = () => {
    balls = [];
    for (let i = 0; i < levelData.balls; i += 1) {
      const ball = new Ball(random(levelData.ballsTypes));
      ball.position = pusherPosition + i * ballDiameter;
      balls.push(ball);
    }
  };

  const pushBalls = () => {
    // шары кончились. запускаем один раз
    if (!balls.length && !ended) {
      ended = true;
      setTimeout(() => {
        clearInterval(ballsPushLoop);
        if (win) {
          alert('You win!)');
          history.push(routes.GAME_LEVELS);
        } else {
          alert('You are a loser');
          history.push(routes.GAME_OVER);
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
      const inserting = prevBallDistance < ballRadius;
      // сдвигаем шар до тех пор, пока он не перестанет наезжать на соседний
      while (ball.position < balls[index - 1].position + ballDiameter - 1) {
        if (inserting) {
          // перемещаем не прокручивая
          ball.positionOffset -= 1;
        }
        ball.position += 1;
      }
      if (prevBallDistance > ballDiameter) {
        holes += 1;
      }
      ball.position -= holes;

      // проигрыш
      if (ball.position >= path.length) {
        if (win) {
          win = false;
          skullRotateAngle = Math.PI * 2 / balls.length;
          dispatch(bulletActions.setState({ state: bulletStates.IDLE, color: 0, angle: 0 }));
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
      dispatch(bulletActions.setState({ state: bulletStates.ARMING, color: 0, angle: 0 }));
    }
  };

  useEffect(() => {
    canvas = ballCanvasRef.current as HTMLCanvasElement;
    canvas.width = frame.width;
    canvas.height = frame.height;
    canvas.style.border = '1px solid';
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    path = getPath(levelData.start, levelData.curve);
    initBalls();
    setRemainigColors(balls);
    if (process.env.NODE_ENV === 'development') {
      balls[balls.length - 1].position = 700;
    }
    ballsPushLoop = window.setInterval(pushBalls, 1000 * (1 / levelData.speed));
    skull.src = skullImage;
    skull.onload = () => {
      ctx.drawImage(skull, levelData.skullPosition.x, levelData.skullPosition.y);
      fastForward();
    };
    return () => {
      clearInterval(ballsPushLoop);
      clearInterval(shotLoop);
      unsubscribe();
    };
  }, []);

  return (
    <canvas className="Layer"
      ref={ballCanvasRef} />
  );
};
