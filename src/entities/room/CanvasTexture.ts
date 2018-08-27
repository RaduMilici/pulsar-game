import Walls from './Walls';
import { Vector2, CanvasTexture as CanvasTextureThree } from 'three';
import { size } from 'pulsar-pathfinding';
import { nearestPowerOf2 } from '../../util';

export default class CanvasTexture extends CanvasTextureThree {
  private static pixelMultiplier: number = 200;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly holeSize: size;

  constructor({ width, height }: size) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = nearestPowerOf2(width * CanvasTexture.pixelMultiplier);
    canvas.height = nearestPowerOf2(height * CanvasTexture.pixelMultiplier);

    super(canvas);

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.fillStyle = 'green';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    this.holeSize = {
      width: Walls.doorWidth * CanvasTexture.pixelMultiplier,
      height: Walls.height * CanvasTexture.pixelMultiplier,
    };
  }

  erase(uv: Vector2): void {
    const x: number = uv.x * this.canvas.width;
    const y: number = uv.y * this.canvas.height;

    this.context.fillStyle = 'black';
    const offsetX: number = x - this.holeSize.width / 2;
    const offsetY: number = y - this.holeSize.height / 2;

    this.context.clearRect(
      offsetX,
      offsetY,
      this.holeSize.width,
      this.holeSize.height
    );
    this.needsUpdate = true;
  }
}
