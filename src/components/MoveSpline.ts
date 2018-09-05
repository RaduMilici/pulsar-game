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
  private readonly onFinish: (position: Vector2) => void;

  constructor({ path, speed, mobile, onFinish }: moveSplineData) {
    super();

    this.speed = speed;
    this.mobile = mobile;
    this.path = new SplineCurve(path);
    this.distancePerTick = this.speed / this.path.getLength();
    this.onFinish = onFinish || (() => {});
  }

  private get reachedDestination(): boolean {
    return this.movementRatio >= 1;
  }

  update({ deltaTime }: tickData) {
    this.movementRatio += this.distancePerTick * deltaTime;

    if (this.reachedDestination) {
      GameObject.app3D.remove(this);
      this.onFinish(this.getPathPoint(1));
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
    this.mobile.lookAt(new Vector3(x, 0, y));
  }

  private getPathPoint(ratio: number): Vector2 {
    return this.path.getPointAt(ratio);
  }
}
