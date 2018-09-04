import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  tickData,
  navigatorSettings,
} from 'pulsar-pathfinding';
import GameComponent from '../components/GameComponent';
import MoveSpline from '../components/MoveSpline';
import Character from '../entities/player/Character';
import { SplineCurve, Vector2, Vector3 } from 'three';

export default class Navigator extends GameComponent {
  private static maxSteps: number = 100;

  private splinePath: SplineCurve;
  private distancePerTick: number;
  private navigator: NavigatorPulsar;
  private splineMovement: MoveSpline;
  private speed: number = 5;
  private movementRatio: number = 0;

  constructor(
    private grid: Grid,
    private begin: NavigatorTile,
    private end: NavigatorTile,
    private mobile: Character
  ) {
    super();

    const settings: navigatorSettings = {
      grid,
      begin,
      end,
      onComplete: this.onNavComplete.bind(this),
      maxSteps: Navigator.maxSteps,
    };
    this.navigator = new NavigatorPulsar(settings);
  }

  /*private get reachedDestination(): boolean {
    return this.movementRatio >= 1;
  }*/

  start(): void {
    this.navigator.start();
  }

  /*update({ deltaTime }: tickData) {
    this.movementRatio += this.distancePerTick * deltaTime;

    if (this.reachedDestination) {
      this.updater.remove(this);
    } else {
      this.rotate();
      this.move();
    }
  }*/

  private onNavComplete(path: NavigatorTile[]): void {
    const vec2Path: Vector2[] = path.map(
      ({ position }: NavigatorTile) => new Vector2(position.x, position.y)
    );

    // this is the first element or the character will snap to the first tile
    const currentPos: Vector2 = new Vector2(this.mobile.position.x, this.mobile.position.z);
    vec2Path.unshift(currentPos);

    this.splineMovement = new MoveSpline({ path: vec2Path, speed: this.speed, mobile: this.mobile });
    this.splineMovement.updater = this.updater;
    this.updater.add(this.splineMovement);
  }

    /*this.splinePath = new SplineCurve(vec2Path);
    this.distancePerTick = this.speed / this.splinePath.getLength();

    this.updater.add(this);
  }

  private move(): void {
    const { x, y }: Vector2 = this.getPathPoint(this.movementRatio);
    this.mobile.position.set(x, this.mobile.height, y);
  }

  private rotate(): void {
    const { x, y }: Vector2 = this.getPathPoint(this.movementRatio + Number.EPSILON);
    const forward: Vector3 = new Vector3(x, this.mobile.height, y).sub(this.mobile.position);
    this.mobile.lookAt(forward);
  }*/

  private getPathPoint(ratio: number): Vector2 {
    return this.splinePath.getPointAt(ratio);
  }
}
