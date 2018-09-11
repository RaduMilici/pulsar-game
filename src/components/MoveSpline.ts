import { moveSplineData } from 'interfaces';
import { SplineCurve, Vector2, Vector3 } from 'three';
import { tickData } from 'pulsar-pathfinding';
import GameComponent from './GameComponent';
import GameObject from 'entities/GameObject';

export default class MoveSpline extends GameComponent {
  private path: SplineCurve;
  private mobile: GameObject;
  private movementRatio: number = 0;

  private readonly speed: number;
  private readonly stopDistance: number;
  private readonly destination: Vector3;
  private readonly distancePerTick: number;
  private readonly onComplete: (position: Vector2) => void;

  constructor({ path, speed, mobile, onComplete = () => {}, stopDistance }: moveSplineData) {
    super();

    this.speed = speed;
    this.mobile = mobile;
    this.stopDistance = stopDistance;
    this.onComplete = onComplete;
    this.path = new SplineCurve(path);
    this.distancePerTick = this.speed / this.path.getLength();

    const {x, y} = path[path.length - 1];
    this.destination = new Vector3(x, 0, y);
  }

  private get reachedDestination(): boolean {
    return this.movementRatio >= 1;
  }

  private get isCloseEnough(): boolean {
    return this.mobile.position.distanceTo(this.destination) <= this.stopDistance;
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
    GameObject.app3D.remove(this);
    this.onComplete(this.getPathPoint(1));
  }
}
