import GameObject from '../GameObject';
import Cube from '../Cube';
import Level from '../level/Level';
import PlayerCamera from './PlayerCamera';
import PlayerController from './PlayerController';
import { Vector3 } from 'three';
import toVector from '../../util/toVector';
import { Vector, NavigatorTile } from 'pulsar-pathfinding';
import Navigator from '../../nav/Navigator';

export default class Player extends GameObject {
  readonly controller: PlayerController;
  private readonly camera: PlayerCamera;
  private activeNavigator: Navigator;

  constructor(readonly level: Level) {
    super();

    const cube: Cube = new Cube();

    this.position.copy(level.rooms.rooms[0].centroidV3);
    this.camera = new PlayerCamera(this, level.app3D.camera);
    this.controller = new PlayerController(level, this);

    level.app3D.add(cube, this);
  }

  moveTo(position: Vector3): void {
    const startV2: Vector = toVector(this.position);
    const positionV2: Vector = toVector(position);
    const start: NavigatorTile = this.level.navigation.getTile(startV2);
    const destination: NavigatorTile = this.level.navigation.getTile(
      positionV2
    );
    const navigator: Navigator = new Navigator(
      this.level.navigation.grid,
      start,
      destination,
      this
    );

    this.startNavigator(navigator);
  }

  private startNavigator(navigator: Navigator): void {
    if (this.activeNavigator) {
      this.level.app3D.remove(this.activeNavigator);
    }

    this.activeNavigator = navigator;
    navigator.updater = this.level.app3D.updater;
    navigator.start();
  }
}
