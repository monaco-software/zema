import skullImage from '../assets/images/skull.webp';

export default class Skull {
  image = new Image();
  constructor() {
    this.image.src = skullImage;
  }
}
