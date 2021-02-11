import frogImage from '../assets/images/frog.png';

export default class Frog {
  image = new Image();
  constructor(
  ) {
    this.image.src = frogImage;
  }
}
