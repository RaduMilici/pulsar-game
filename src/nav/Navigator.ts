import {
  Navigator as NavigatorPulsar,
  NavigatorTile,
  Grid,
  navigatorSettings,
  Component,
} from 'pulsar-pathfinding';
import { toVec2 } from 'util';
import { Vector2 } from 'three';
import { moveSplineData } from 'interfaces';
import MoveSpline from 'components/MoveSpline';
import GameObject from 'entities/GameObject';
import Character from 'entities/character/Character';
import NavigatorWorker from "worker-loader?publicPath=dist/&name=NavigatorWorker.js!./NavigatorWorker";

export default class Navigator {
  private static maxSteps: number = 200;

  private navigator: NavigatorPulsar;
  private splineMovement: Component = new Component();
  private navigatorWorker: NavigatorWorker;

  constructor(
    private grid: Grid,
    private begin: NavigatorTile,
    private end: NavigatorTile,
    private mobile: Character,
  ) {
    const settings: navigatorSettings = {
      grid,
      begin,
      end,
      onComplete: (path: NavigatorTile[]) => this.onNavComplete(path),
      maxSteps: Navigator.maxSteps,
    };
    /*this.navigatorWorker = new NavigatorWorker();
    this.navigatorWorker.postMessage(settings);

    this.navigatorWorker.addEventListener("message", (event: MessageEvent) => {
      console.log('addEventListener');
      console.log(event.data);
    });*/


    this.navigator = new NavigatorPulsar(settings);
  }

  start(): void {
    if (this.begin && this.end) {
      this.navigator.start();
    }
  }

  stop() {
    GameObject.app3D.remove(this.splineMovement);
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
      onComplete: () => { this.mobile.onNavComplete() },
      stopDistance: this.mobile.navStopDistance
    };
    this.splineMovement = new MoveSpline(data);
    GameObject.app3D.add(this.splineMovement);
  }
}
