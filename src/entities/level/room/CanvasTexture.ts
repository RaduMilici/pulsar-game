import { Vector2, CanvasTexture as CanvasTextureThree } from 'three';
import { size, point } from 'pulsar-pathfinding';
import { nearestPowerOf2 } from '../../../util/index';
import { wallColor } from '../../../const/colors';

export default class CanvasTexture extends CanvasTextureThree {
  private static pixelMultiplier: number = 20;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor({ width, height }: size) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    const multipliedWidth: number = CanvasTexture.getPixelMultiplier(width);
    const multipliedHeight: number = CanvasTexture.getPixelMultiplier(height);

    canvas.width = nearestPowerOf2(multipliedWidth);
    canvas.height = nearestPowerOf2(multipliedHeight);

    super(canvas);

    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.context.fillStyle = wallColor;
    this.context.fillRect(0, 0, canvas.width, canvas.height);
  }

  static getPixelMultiplier(size: number): number {
    return size * CanvasTexture.pixelMultiplier;
  }

  erase(uv: Vector2, size: size): void {
    const { x, y }: point = this.getCoords(uv);
    const offsetX: number = x - size.width / 2;
    const offsetY: number = y - size.height / 2;
    this.clearRect({ x: offsetX, y: offsetY }, size);
  }

  drawRect(uv: Vector2, size: size): void {
    const { x, y }: point = this.getCoords(uv);
    this.context.fillStyle = 'black';
    const offsetX: number = x - size.width / 2;
    const offsetY: number = y - size.height / 2;
    this.fillRect({ x: offsetX, y: offsetY }, size);
  }

  private getCoords(uv: Vector2): point {
    const x: number = uv.x * this.canvas.width;
    const y: number = uv.y * this.canvas.height;
    return { x, y };
  }

  private fillRect({ x, y }: point, { width, height }: size): void {
    this.context.fillRect(x, y, width, height);
    this.needsUpdate = true;
  }

  private clearRect({ x, y }: point, { width, height }: size): void {
    this.context.clearRect(x, y, width, height);
    this.needsUpdate = true;
  }
}
