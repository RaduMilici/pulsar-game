import { moveSplineData } from 'types';
import { SplineCurve, Vector2, Vector3 } from 'three';
import { tickData } from 'pulsar-pathfinding';
import GameComponent from './GameComponent';
import Mobile from 'entities/Mobile';

export default class MoveSpline extends GameComponent {
  private path: SplineCurve;
  private mobile: Mobile;
  private movementRatio: number = 0;

  private readonly destination: Vector3;
  private readonly distancePerTick: number;
  private readonly onComplete: (position: Vector2) => void;

  constructor({ path, mobile, onComplete = () => {} }: moveSplineData) {
    super();

    this.mobile = mobile;
    this.onComplete = onComplete;
    this.path = new SplineCurve(path);
    this.distancePerTick = this.mobile.speed / this.path.getLength();

    const { x, y } = path[path.length - 1];
    this.destination = new Vector3(x, 0, y);
  }

  private get reachedDestination(): boolean {
    return this.movementRatio >= 1;
  }

  private get isCloseEnough(): boolean {
    return this.mobile.position.distanceTo(this.destination) <= this.mobile.navStopDistance;
  }

  update({ deltaTime }: tickData) {
    this.movementRatio += this.distancePerTick * deltaTime;

    if (this.reachedDestination || this.isCloseEnough) {
      this.stopMovement();
    } else {
      this.rotate();
      this.move();
    }
  }

  private move(): void {
    console.log(this.movementRatio);
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

  private stopMovement(): void {
    app3D.remove(this);
    this.onComplete(this.getPathPoint(1));
  }
}
