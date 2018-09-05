import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  navigatorSettings,
  Updater,
  Component,
} from 'pulsar-pathfinding';
import { toVec2 } from '../util';
import MoveSpline from '../components/MoveSpline';
import Character from '../entities/character/Character';
import { Vector2 } from 'three';
import moveSplineData from '../types/moveSplineData';

export default class Navigator {
  private static maxSteps: number = 200;

  private navigator: NavigatorPulsar;
  private speed: number = 15;
  private splineMovement: Component = new Component();

  constructor(
    private grid: Grid,
    private begin: NavigatorTile,
    private end: NavigatorTile,
    private mobile: Character,
    private readonly updater: Updater
  ) {
    const settings: navigatorSettings = {
      grid,
      begin,
      end,
      onComplete: this.onNavComplete.bind(this),
      maxSteps: Navigator.maxSteps,
    };

    this.navigator = new NavigatorPulsar(settings);
  }

  start(): void {
    if (this.begin && this.end) {
      this.navigator.start();
    }
  }

  stop() {
    this.updater.remove(this.splineMovement);
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
      speed: this.speed,
      mobile: this.mobile,
      updater: this.updater,
    };
    this.splineMovement = new MoveSpline(data);
    this.updater.add(this.splineMovement);
  }
}
