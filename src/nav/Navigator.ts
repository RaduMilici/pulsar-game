import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
} from 'pulsar-pathfinding';
import GameComponent from '../components/GameComponent';
import GameObject from '../entities/GameObject';
import { SplineCurve, Vector2 } from 'three';

export default class Navigator extends GameComponent {
  private navPath: NavigatorTile[];
  private vec2Path: Vector2[];
  private splinePath: SplineCurve;
  private splinePathLength: number;
  private speed: number = 0.1;
  private percentOfSpline: number = 0;
  private navigator: NavigatorPulsar;

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
    console.time('nav');
    this.navigator.start();
  }

  private get reachedDestination(): boolean {
    return this.percentOfSpline >= 1;
  }

  private onNavComplete(path: NavigatorTile[]): void {
    this.navPath = path;
    this.vec2Path = [this.origin, ...path].map(
      ({ position }: NavigatorTile) => {
        return new Vector2(position.x, position.y);
      }
    );
    this.splinePath = new SplineCurve(this.vec2Path);
    this.splinePathLength = this.splinePath.getLength();
    this.updater.add(this);
    console.timeEnd('nav');
  }

  update() {
    this.percentOfSpline += this.speed / this.splinePathLength;

    if (this.reachedDestination) {
      return this.updater.remove(this);
    }

    const positionOnSpline: Vector2 = this.splinePath.getPointAt(
      this.percentOfSpline
    );
    this.mobile.position.set(positionOnSpline.x, 0, positionOnSpline.y);
  }
}
