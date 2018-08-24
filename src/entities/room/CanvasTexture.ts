import { Texture} from "three";
import { randomColor } from 'pulsar-pathfinding';

export default class CanvasTexture extends Texture {

  constructor() {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const context: CanvasRenderingContext2D = canvas.getContext('2d');
    context.fillStyle = randomColor();
    context.fillRect(0, 0, canvas.width, canvas.height);

    super(canvas);

    this.needsUpdate = true;
  }

}