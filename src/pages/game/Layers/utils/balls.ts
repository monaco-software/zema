import Ball from '../../lib/ball';
import levels from '../../levels';
import { Physics } from '../../types';
import { random } from '../../lib/utils';
import { uniqAndSort } from '@common/utils';
import { BALL_DIAMETER, BALL_RADIUS } from '../../constants';

export const gameBalls: Ball[] = [];

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
  if (both && (left.length < 2 || right.length < 1)) {
    return [index];
  }
  left.push(...right);
  return uniqAndSort(left);
};

export const getBallsRemainColors = (): number[] => {
  return gameBalls.reduce((memo: number[], ball) =>
    memo.includes(ball.color) ? memo : [...memo, ball.color],
  []);
};

export const getRandomColorFromRemains = () => {
  const colors = getBallsRemainColors();
  return colors[random(colors.length)];
};

export const createBalls = (level: number): Ball[] => {
  const levelData = levels[level];
  const pusherPosition = -1 * levelData.balls * BALL_DIAMETER;

  gameBalls.length = 0;

  for (let i = 0; i < levelData.balls; i += 1) {
    const randomIndex = random(levelData.ballColors.length);
    const ball = new Ball(levelData.ballColors[randomIndex]);
    ball.position = pusherPosition + i * BALL_DIAMETER;
    gameBalls.push(ball);
  }
  return gameBalls;
};

// рассчитывает положение шаров исходя из позиции
// толкателя, текущих промежутков и ускорения
export const applyPhysic = (pusherPosition: number): Physics => {
  const impacts: number[] = [];
  let pusherOffset = 0;
  gameBalls.forEach((ball, ballIndex) => {
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
      const prevBallPosition = gameBalls[ballIndex - 1].position;
      const prevBallDistance = ball.position - prevBallPosition;
      // признак того, что был вставлен шар
      const inserting = prevBallDistance < BALL_RADIUS;
      // сдвигаем шар до тех пор, пока он не перестанет наезжать на соседний
      while (ball.position < prevBallPosition + BALL_DIAMETER - 1) {
        ball.position += 1;
        if (inserting) {
          // перемещаем не прокручивая
          ball.rotationOffset -= 1;
        }
      }
      if (prevBallDistance > BALL_DIAMETER) {
        // разрыв. придаем шарам ускорение
        ball.acceleration += 1;
        for (let i = ballIndex; i < gameBalls.length; i += 1) {
          gameBalls[i].position -= ball.acceleration > BALL_DIAMETER ? BALL_DIAMETER : ball.acceleration;
        }
      } else {
        // столкновение. чем сильнее разгон, тем дальше отлетают шары
        const moveDistance = Math.floor(Math.pow(ball.acceleration - 9, 2));
        if (ball.acceleration && moveDistance > 0) {
          for (let i = 0; i < gameBalls.length; i += 1) {
            gameBalls[i].position -= moveDistance;
            gameBalls[i].rotationOffset -= 1;
          }
          // толкатель отлетает дальше
          pusherOffset -= moveDistance + 4;
          ball.acceleration = 0;
          impacts.push(ballIndex);
        }
      }
    }
  });
  return { pusherOffset, impacts };
};

