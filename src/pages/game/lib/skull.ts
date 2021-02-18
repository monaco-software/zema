import skullImage from '../assets/images/skull.png';

export default class Skull {
  image = new Image();
  constructor() {
    this.image.src = skullImage;
  }
}
