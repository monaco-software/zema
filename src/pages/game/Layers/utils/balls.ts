import Ball from '../../lib/ball';
import { random } from '../../lib/utils';
import { BALL_DIAMETER, BALL_RADIUS } from '../../constants';
import levels from '../../levels';
import { Physics } from '../../types';

// возвращает массив индексов одинаковых шаров рядом с заданным
export const findSame = (balls: Ball[], index: number, both = false): number[] => {
  const left = [];
  const right = [];
  if (!balls || !balls[index]) {
    return [];
  }
  const color = balls[index].color;
  // проверяем слева
  let fail = false;
  for (let b = index; b >= 0 && !fail; b -= 1) {
    if (balls[b].color === color) {
      left.push(b);
    } else {
      fail = true;
    }
  }
  // проверяем справа
  fail = false;
  for (let f = index; f < balls.length && !fail; f += 1) {
    if (balls[f].color === color) {
      right.push(f);
    } else {
      fail = true;
    }
  }
  const res = left.concat(right);
  if (both && (left.length < 2 || right.length < 2)) {
    return [index];
  }

  return [...new Set(res.sort((n1, n2) => n1 - n2))];
};

// высчитыват оставшиеся на поле цвета
// после попадания и всех столкновений
// принимает массив шаров и индекс вставки
// возвращает массив индексов цветов
export const calculateRemainColors = (b: Ball[], i: number): number[] => {
  const balls = b.slice();
  let index = i;
  let sameBalls = findSame(balls, index);
  while (sameBalls.length >= 3) {
    index = sameBalls[0];
    balls.splice(index, sameBalls.length);
    sameBalls = findSame(balls, index, true);
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
  const pusherPosition = -levelData.balls * BALL_DIAMETER;
  const balls = [];

  for (let i = 0; i < levelData.balls; i += 1) {
    const randomIndex = random(levelData.ballColors.length);
    const ball = new Ball(levelData.ballColors[randomIndex]);
    ball.position = pusherPosition + i * BALL_DIAMETER;
    balls.push(ball);
  }
  return balls;
};

// рассчитывает положение шаров исходя из позиции
// толкателя, текущих промежутков и ускорения
export const applyPhysic = (balls: Ball[], pusherPosition: number): Physics => {
  const impacts: number[] = [];
  let pusherOffset = 0;
  balls.forEach((ball, ballIndex) => {
    if (ballIndex === 0) {
      if (ball.position <= pusherPosition) {
        ball.position = pusherPosition;
      }
      if (ball.position > pusherPosition) {
        // толкатель догоняет шары из дальней позиции за одинаковое количество тиков
        const pusherDistance = ball.position - pusherPosition;
        pusherOffset = pusherDistance > 4 ? pusherDistance - 3 : 0;
      }
    } else {
      const prevBallPosition = balls[ballIndex - 1].position;
      const prevBallDistance = ball.position - prevBallPosition;
      // признак того, что был вставлен шар
      const inserting = prevBallDistance < BALL_RADIUS;
      // сдвигаем шар до тех пор, пока он не перестанет наезжать на соседний
      while (ball.position < prevBallPosition + BALL_DIAMETER - 1) {
        ball.position += 1;
        if (inserting) {
          // перемещаем не прокручивая
          ball.positionOffset -= 1;
        }
      }
      if (prevBallDistance > BALL_DIAMETER) {
        // разрыв. придаем шарам ускорение
        ball.acceleration += 1;
        for (let i = ballIndex; i < balls.length; i += 1) {
          balls[i].position -= ball.acceleration > BALL_DIAMETER ? BALL_DIAMETER : ball.acceleration;
        }
      } else {
        // столкновение. чем сильнее разгон, тем дальше отлетают шары
        const moveDistance = Math.floor(Math.pow(ball.acceleration - 9, 2));
        if (ball.acceleration && moveDistance > 0) {
          for (let i = 0; i < balls.length; i += 1) {
            balls[i].position -= moveDistance;
            balls[i].positionOffset -= 1;
          }
          // толькатель отлетает дальше
          pusherOffset -= moveDistance + 4;
          ball.acceleration = 0;
          impacts.push(ballIndex);
        }
      }
    }
  });
  return { pusherOffset, impacts };
};

