import { Vector, NavigatorTile } from 'pulsar-pathfinding';
import { Vector3 } from 'three';
import { moveSplineData, mobileData } from 'types';
import MoveSpline from 'components/MoveSpline.component';
import toVector from 'util/toVector';
import Navigator from 'nav/Navigator';
import Navigation from 'nav/Navigation';
import GameObject from './GameObject';

export default class Mobile extends GameObject {
  destination: NavigatorTile;
  readonly navStopDistance: number;
  readonly speed: number;
  readonly navigation: Navigation;
  private navigator: Navigator;
  private moveSpline: MoveSpline;

  constructor({ speed, navStopDistance, navigation }: mobileData) {
    super();
    this.speed = speed;
    this.navStopDistance = navStopDistance;
    this.navigation = navigation;
    this.destination = this.getInitialPositionAsDestination();
  }

  onNavStart(): void {}

  onNavComplete(): void {}

  onChangeTile(tile: NavigatorTile): void {}

  moveTo(position: Vector3): void {
    const startV2: Vector = toVector(this.position);
    const positionV2: Vector = toVector(position);
    const start: NavigatorTile = this.navigation.getTile(startV2);
    this.destination = this.navigation.getTile(positionV2);

    const navigator: Navigator = new Navigator(this.navigation.grid, start, this.destination, this);

    this.startNavigator(navigator);
  }

  moveToUsingSpline(data: moveSplineData) {
    this.moveSpline = new MoveSpline(data);
    app3D.add(this.moveSpline);
  }

  faceTo({ x, z }: Vector3): void {
    this.stopNavigator();
    this.lookAt(new Vector3(x, 0, z));
  }

  private startNavigator(navigator: Navigator): void {
    this.stopNavigator();
    this.navigator = navigator;
    navigator.start();
  }

  private stopNavigator(): void {
    app3D.remove(this.moveSpline);
  }

  private getInitialPositionAsDestination(): NavigatorTile {
    return this.navigation.getTile(toVector(this.position));
  }
}
