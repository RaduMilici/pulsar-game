import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  tickData,
} from 'pulsar-pathfinding';
import GameComponent from '../components/GameComponent';
import GameObject from '../entities/GameObject';
import { SplineCurve, Vector2 } from 'three';

export default class Navigator extends GameComponent {
  private splinePath: SplineCurve;
  private distancePerTick: number;
  private navigator: NavigatorPulsar;

  private speed: number = 5;
  private movementRatio: number = 0;

  constructor(
    private grid: Grid,
    private origin: NavigatorTile,
    private destination: NavigatorTile,
    private mobile: GameObject
  ) {
    super();

    this.navigator = new NavigatorPulsar(
      grid,
      origin,
      destination,
      undefined,
      this.onNavComplete.bind(this)
    );
  }

  start(): void {
    this.navigator.start();
  }

  update({ deltaTime }: tickData) {
    this.movementRatio += this.distancePerTick * deltaTime;

    if (this.reachedDestination) {
      this.updater.remove(this);
    } else {
      this.move();
    }
  }

  private get reachedDestination(): boolean {
    return this.movementRatio >= 1;
  }

  private onNavComplete(path: NavigatorTile[]): void {
    const vec2Path: Vector2[] = path.map(
      ({ position }: NavigatorTile) => new Vector2(position.x, position.y)
    );
    const currentPos: Vector2 = new Vector2(
      this.mobile.position.x,
      this.mobile.position.z
    );

    vec2Path.unshift(currentPos);

    this.splinePath = new SplineCurve(vec2Path);
    this.distancePerTick = this.speed / this.splinePath.getLength();

    this.updater.add(this);
  }

  private move(): void {
    const { x, y }: Vector2 = this.splinePath.getPointAt(this.movementRatio);
    this.mobile.position.set(x, 0, y);
  }
}
