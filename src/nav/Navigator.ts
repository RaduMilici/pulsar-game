import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  navigatorSettings,
  Updater,
  Component,
} from 'pulsar-pathfinding';
import MoveSpline from '../components/MoveSpline';
import Character from '../entities/player/Character';
import { Vector2 } from 'three';

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
    this.navigator.start();
  }

  stop() {
    this.updater.remove(this.splineMovement);
  }

  private onNavComplete(path: NavigatorTile[]): void {
    const vec2Path: Vector2[] = path.map(
      ({ position }: NavigatorTile) => new Vector2(position.x, position.y)
    );

    // this is the first element or the character will snap to the first tile
    const currentPos: Vector2 = new Vector2(this.mobile.position.x, this.mobile.position.z);
    vec2Path.unshift(currentPos);

    this.splineMovement = new MoveSpline({
      path: vec2Path,
      speed: this.speed,
      mobile: this.mobile,
      updater: this.updater,
    });
    this.updater.add(this.splineMovement);
  }
}
