import { size } from 'pulsar-pathfinding';
import Canvas from 'components/shaders/Canvas';

export default class NoiseImage extends Canvas {
  readonly image: HTMLImageElement;
  private readonly context2D: CanvasRenderingContext2D;
  private step: number = 50;

  constructor(size: size) {
    super(size);
    this.context2D = this.canvas.getContext('2d');
    this.makeNoise();
    this.image = new Image();
    this.image.src = this.canvas.toDataURL();
  }

  private makeNoise(): void {
    for (let w = 0; w < this.size.width; w += this.step) {
      for (let h = 0; h < this.size.height; h += this.step) {
        this.context2D.fillStyle = NoiseImage.randomGrayHex();
        this.context2D.fillRect(w, h, this.step, this.step);
      }
    }
  }

  private static randomGrayHex(): string {
    const v: string = (Math.random()*(256)|0).toString(16);
    return `#${v}${v}${v}`;
  }
}
