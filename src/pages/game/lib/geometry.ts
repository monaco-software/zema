export function getLineLen(sx: number, sy: number, ex: number, ey: number) {
  return Math.sqrt(Math.pow(sx - ex, 2) + Math.pow(sy - ey, 2));
}

// Принимает смещение и контрольные точки кривой Безье
// Возвращает координаты точки
export function getBezierXY(
  t: number,
  sx: number,
  sy: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  ex: number,
  ey: number
) {
  return [
    Math.pow(1 - t, 3) * sx +
      3 * t * Math.pow(1 - t, 2) * cp1x +
      3 * t * t * (1 - t) * cp2x +
      t * t * t * ex,
    Math.pow(1 - t, 3) * sy +
      3 * t * Math.pow(1 - t, 2) * cp1y +
      3 * t * t * (1 - t) * cp2y +
      t * t * t * ey,
  ];
}

// Принимает смещение и контрольные точки кривой Безье
// Возвращает угол касательной
export function getBezierAngle(
  t: number,
  sx: number,
  sy: number,
  cp1x: number,
  cp1y: number,
  cp2x: number,
  cp2y: number,
  ex: number,
  ey: number
) {
  const dx =
    Math.pow(1 - t, 2) * (cp1x - sx) +
    2 * t * (1 - t) * (cp2x - cp1x) +
    t * t * (ex - cp2x);
  const dy =
    Math.pow(1 - t, 2) * (cp1y - sy) +
    2 * t * (1 - t) * (cp2y - cp1y) +
    t * t * (ey - cp2y);
  return -Math.atan2(dx, dy) + 0.5 * Math.PI;
}

// Принимает стартовую точку и массив контрольных точек кривых Безье
// возвращает массив точек через промежутки >= quantum
export function getPath(
  start: number[],
  curve: number[][],
  quantum = 1,
  frequency = 5000
): number[][] {
  const res: number[][] = [];
  let last = start.slice();
  curve.forEach((c) => {
    for (let i = 0; i < 1; i += 1 / frequency) {
      const point = getBezierXY(
        i,
        last[0],
        last[1],
        c[0],
        c[1],
        c[2],
        c[3],
        c[4],
        c[5]
      );
      point.push(
        getBezierAngle(i, last[0], last[1], c[0], c[1], c[2], c[3], c[4], c[5])
      );
      if (i === 0) {
        res.push(point);
      } else {
        const distance = getLineLen(
          res[res.length - 1][0],
          res[res.length - 1][1],
          point[0],
          point[1]
        );
        if (distance >= quantum) {
          res.push(point);
        }
      }
    }
    last = [c[4], c[5]];
  });
  return res;
}

// Принимает 2 массива координат
// Возвращает индексы ближайших точек
export function getCloserPoints(a: number[][], b: number[][]): number[] {
  let res = [0, 0];
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (let ai = 0; ai < a.length; ai += 1) {
    for (let bi = 0; bi < b.length; bi += 1) {
      let currentDistance = getLineLen(a[ai][0], a[ai][1], b[bi][0], b[bi][1]);
      if (minDistance > currentDistance) {
        minDistance = currentDistance;
        res = [ai, bi];
      }
    }
  }
  return res;
}

// Принимает массив координат и координаты точки
// Возвращает индекс ближайшей точки из массива
export function getCloserPoint(a: number[][], x: number, y: number): number {
  let res = 0;
  let minDistance = Number.MAX_SAFE_INTEGER;
  for (let ai = 0; ai < a.length; ai += 1) {
    let currentDistance = getLineLen(a[ai][0], a[ai][1], x, y);
    if (minDistance > currentDistance) {
      minDistance = currentDistance;
      res = ai;
    }
  }
  return res;
}

export const toRadians = (degrees: number) => {
  return (degrees * Math.PI) / 180;
};

export const toDegrees = function (radians: number) {
  return (radians * 180) / Math.PI;
};
