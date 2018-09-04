import GameComponent from '../components/GameComponent';
import GameObject from '../entities/GameObject';
import moveSplineData from '../types/moveSplineData';
import { SplineCurve, Vector2, Vector3 } from 'three';
import { tickData } from 'pulsar-pathfinding';

export default class MoveSpline extends GameComponent {
  private path: SplineCurve;
  private mobile: GameObject;
  private movementRatio: number = 0;

  private readonly speed: number;
  private readonly distancePerTick: number;

  constructor({ path, speed, mobile }: moveSplineData) {
    super();

    this.speed = speed;
    this.mobile = mobile;
    this.path = new SplineCurve(path);
    this.distancePerTick = this.speed / this.path.getLength();
  }

  private get reachedDestination(): boolean {
    return this.movementRatio >= 1;
  }

  update({ deltaTime }: tickData) {
    this.movementRatio += this.distancePerTick * deltaTime;

    if (this.reachedDestination) {
      this.updater.remove(this);
    } else {
      this.rotate();
      this.move();
    }
  }

  private move(): void {
    const { x, y }: Vector2 = this.getPathPoint(this.movementRatio);
    this.mobile.position.set(x, 0, y);
  }

  private rotate(): void {
    const { x, y }: Vector2 = this.getPathPoint(this.movementRatio + Number.EPSILON);
    const forward: Vector3 = new Vector3(x, 0, y).sub(this.mobile.position);
    this.mobile.lookAt(forward);
  }

  private getPathPoint(ratio: number): Vector2 {
    return this.path.getPointAt(ratio);
  }
}
