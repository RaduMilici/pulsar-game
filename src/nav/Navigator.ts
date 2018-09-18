import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  navigatorSettings,
} from 'pulsar-pathfinding';
import { toVec2 } from 'util';
import { Vector2 } from 'three';
import { moveSplineData, moveSplineStep } from 'types';
import Mobile from 'entities/Mobile';
import { MAX_NAV_ITERATIONS } from 'const';

export default class Navigator {
  private navigator: NavigatorPulsar;

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

    const steps: moveSplineStep[] = path.map((tile: NavigatorTile) => {
      return { position: toVec2(tile.position), tile };
    });

    // Add this as the first element or the character will snap to the first tile's position.
    const currentPos: Vector2 = new Vector2(this.mobile.position.x, this.mobile.position.z);
    steps.unshift({ position: currentPos });

    const data: moveSplineData = {
      path: steps,
      mobile: this.mobile,
      onComplete: () => {
        this.mobile.onNavComplete();
      },
    };
    this.mobile.moveToUsingSpline(data);
    this.mobile.onNavStart();
  }
}
