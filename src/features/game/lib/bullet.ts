import Ball from './ball';

class Bullet extends Ball {
  protected static instance: Bullet;

  // @ts-ignore because a singleton
  constructor() {
    if (Bullet.instance) {
      return Bullet.instance;
    }
    super();
    Bullet.instance = this;
  }
}
const bulletObject = new Bullet();
export default bulletObject;

