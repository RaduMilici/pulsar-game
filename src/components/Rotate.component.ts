import { tickData } from 'pulsar-pathfinding';
import GameComponent from './GameComponent';

export default class Rotate extends GameComponent {
  constructor(private readonly x: number, private readonly y: number, private readonly z: number) {
    super();
  }

  update({ deltaTime }: tickData): void {
    this.rotate(deltaTime);
  }

  private rotate(deltaTime: number): void {
    const { x, y, z } = this.gameObject.rotation;
    const newX = x + this.x * deltaTime;
    const newY = y + this.y * deltaTime;
    const newZ = z + this.z * deltaTime;

    this.gameObject.rotation.set(newX, newY, newZ);
  }
}
