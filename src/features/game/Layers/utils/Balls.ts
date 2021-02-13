import Ball from '../../lib/ball';
import { random } from '../../lib/utils';
import { BALL_RADIUS } from '../../constants';
import levels from '../../levels';
import { Physics } from '../../types';

// возвращает массив индексов одинаковых шаров рядом с заданным
export const findSame = (balls: Ball[], index: number): number[] => {
  const res = [];
  if (!balls || !balls[index]) {
    return [];
  }
  const color = balls[index].color;
  // проверяем следующие
  let fail = false;
  for (let f = index; f < balls.length && !fail; f += 1) {
    if (balls[f].color === color) {
      res.push(f);
    } else {
      fail = true;
    }
  }
  // проверяем предыдущие
  fail = false;
  for (let b = index; b >= 0 && !fail; b -= 1) {
    if (balls[b].color === color) {
      res.push(b);
    } else {
      fail = true;
    }
  }
  return [...new Set(res.sort((n1, n2) => n1 - n2))];
};

export const calculateRemainColors = (b: Ball[], i: number): number[] => {
  const balls = b.slice();
  let index = i;
  let sameBalls = findSame(balls, index);
  while (sameBalls.length >= 3) {
    index = sameBalls[0];
    balls.splice(index, sameBalls.length);
    sameBalls = findSame(balls, index);
  }
  const remainColors: number[] = [];
  balls.forEach((ball) => {
    if (!remainColors.includes(ball.color)) {
      remainColors.push(ball.color);
    }
  });
  return remainColors.sort((n1, n2) => n1 - n2);
};

export const createBalls = (level: number): Ball[] => {
  const levelData = levels[level];
  const pusherPosition = -levelData.balls * BALL_RADIUS * 2;
  const balls = [];

  for (let i = 0; i < levelData.balls; i += 1) {
    const randomIndex = random(levelData.ballColors.length);
    const ball = new Ball(levelData.ballColors[randomIndex]);
    ball.position = pusherPosition + i * BALL_RADIUS * 2;
    balls.push(ball);
  }
  return balls;
};

export const applyPhysic = (balls: Ball[], pusherPosition: number): Physics => {
  const impacts: number[] = [];
  let pusherOffset = 0;
  balls.forEach((ball, ballIndex) => {
    if (ballIndex === 0) {
      if (ball.position <= pusherPosition) {
        ball.position = pusherPosition;
      }
      if (ball.position > pusherPosition) {
        // толкатель догоняет шары из дальней позицци за одинаковое количество тиков
        const pusherDistance = ball.position - pusherPosition;
        pusherOffset = pusherDistance > 3 ? pusherDistance - 3 : 0;
      }
    } else {
      const prevBallPosition = balls[ballIndex - 1].position;
      const prevBallDistance = ball.position - prevBallPosition;
      // признак того, что был вставлен шар
      const inserting = prevBallDistance <= BALL_RADIUS;
      // сдвигаем шар до тех пор, пока он не перестанет наезжать на соседний
      while (ball.position < prevBallPosition + BALL_RADIUS * 2 - 1) {
        ball.position += 1;
        if (inserting) {
          // перемещаем не прокручивая
          ball.positionOffset -= 1;
        }
      }
      // разрыв. придаем шарам ускорение
      if (prevBallDistance > BALL_RADIUS * 2) {
        ball.acceleration += 1;
        for (let i = ballIndex; i < balls.length; i += 1) {
          balls[i].position -= ball.acceleration > BALL_RADIUS * 2 ? BALL_RADIUS * 2 : ball.acceleration;
        }
      } else {
        // столкновение. чем сильнее разгон, тем дальше отлетают шары
        const moveDistance = Math.floor(Math.pow(ball.acceleration - 10, 2));
        if (ball.acceleration && moveDistance > 0) {
          for (let i = 0; i < balls.length; i += 1) {
            balls[i].position -= moveDistance;
            balls[i].positionOffset -= 1;
          }
          pusherOffset -= moveDistance + 3;
          ball.acceleration = 0;
          impacts.push(ballIndex);
        }
      }
    }
  });
  return { pusherOffset, impacts };
};

