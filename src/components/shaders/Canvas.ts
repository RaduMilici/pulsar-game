import { Component, size } from 'pulsar-pathfinding';
import { nearestPowerOf2 } from 'util';

export default class Canvas extends Component {
  readonly size: size;
  readonly canvas: HTMLCanvasElement;

  constructor({ width, height }: size) {
    super();
    this.size = {
      width: nearestPowerOf2(width),
      height: nearestPowerOf2(height)
    };
    this.canvas = this.createCanvas();
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = this.size.width;
    canvas.height = this.size.height;
    return canvas;
  }
}
