import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  navigatorSettings,
  Component,
} from 'pulsar-pathfinding';
import { toVec2 } from 'util';
import { Vector2 } from 'three';
import { moveSplineData } from 'types';
import Mobile from 'entities/Mobile';
import { MAX_NAV_ITERATIONS } from 'const';

export default class Navigator {
  private navigator: NavigatorPulsar;
  private splineMovement: Component = new Component();

  constructor(
    private grid: Grid,
    private begin: NavigatorTile,
    private end: NavigatorTile,
    private mobile: Mobile
  ) {
    const settings: navigatorSettings = {
      grid,
      begin,
      end,
      onComplete: this.onNavComplete.bind(this),
      maxSteps: MAX_NAV_ITERATIONS,
    };

    this.navigator = new NavigatorPulsar(settings);
  }

  start(): void {
    if (this.begin && this.end) {
      this.navigator.start();
    }
  }

  private onNavComplete(path: NavigatorTile[]): void {
    /*
    * Most likely NavigatorPulsar went over Navigator.maxSteps and returned an empty array.
    * No need to continue.
    */
    if (path.length === 0) return;

    const vec2Path: Vector2[] = path.map(({ position }: NavigatorTile) => toVec2(position));

    // Add this as the first element or the character will snap to the first tile's position.
    const currentPos: Vector2 = new Vector2(this.mobile.position.x, this.mobile.position.z);
    vec2Path.unshift(currentPos);

    const data: moveSplineData = {
      path: vec2Path,
      speed: this.mobile.speed,
      mobile: this.mobile,
      onComplete: () => {
        this.mobile.onNavComplete();
      },
      stopDistance: this.mobile.navStopDistance,
    };
    this.mobile.moveToUsingSpline(data);
    this.mobile.onNavStart();
  }
}
