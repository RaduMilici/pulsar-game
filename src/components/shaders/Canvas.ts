import { Component, size } from 'pulsar-pathfinding';

export default class Canvas extends Component {
  protected readonly canvas: HTMLCanvasElement;

  constructor(protected size: size) {
    super();
    this.canvas = this.createCanvas();
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = this.size.width;
    canvas.height = this.size.height;
    return canvas;
  }
}
