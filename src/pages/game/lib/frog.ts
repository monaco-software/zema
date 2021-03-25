import frogImage from '../assets/images/frog.webp';

export default class Frog {
  image = new Image();
  constructor() {
    this.image.src = frogImage;
  }
}
