import Ball from './ball';

class Bullet extends Ball {
  protected remainColors: number[] = [];

  protected static instance: Bullet;

  // @ts-ignore because a singleton
  constructor() {
    if (Bullet.instance) {
      return Bullet.instance;
    }
    super();
    Bullet.instance = this;
  }

  // setRemainColors(remain: number[]) {
  //   this.remainColors = remain.slice();
  //   console.log(this.remainColors);
  // }
  //
  // setRandomColorFromRemain() {
  //   this.color = this.remainColors[random(this.remainColors.length)];
  // }
}
const bulletObject = new Bullet();
export default bulletObject;

