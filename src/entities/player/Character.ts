import GameObject from '../GameObject';
import Cone from '../Cone';
import Level from '../level/Level';
import PlayerCamera from './PlayerCamera';
import PlayerController from './PlayerController';
import { Vector3, Object3D } from 'three';
import toVector from '../../util/toVector';
import { Vector, NavigatorTile } from 'pulsar-pathfinding';
import Navigator from '../../nav/Navigator';
import Projectile from './Projectile';
import projectileData from '../../types/projectileData';

export default class Character extends GameObject {
  readonly mesh: Object3D;
  readonly controller: PlayerController;
  readonly height: number = 0;

  private readonly camera: PlayerCamera;
  private activeNavigator: Navigator;

  constructor(readonly level: Level) {
    super();

    this.position.copy(level.rooms.rooms[0].centroidV3);
    this.camera = new PlayerCamera(this, level.app3D.camera);
    this.controller = new PlayerController(level, this);

    this.mesh = new Cone();
    this.add(this.mesh);
  }

  faceTo({ x, z }: Vector3): void {
    this.stopActiveNavigator();
    this.lookAt(new Vector3(x, 0, z));
  }

  moveTo(position: Vector3): void {
    const startV2: Vector = toVector(this.position);
    const positionV2: Vector = toVector(position);
    const start: NavigatorTile = this.level.navigation.getTile(startV2);
    const destination: NavigatorTile = this.level.navigation.getTile(positionV2);

    const navigator: Navigator = new Navigator(
      this.level.navigation.grid,
      start,
      destination,
      this,
      this.level.app3D.updater
    );

    this.startNavigator(navigator);
  }

  launchProjectile(destination: Vector3): void {
    const data: projectileData = {
      begin: this.position,
      end: destination,
      speed: 35,
      navigation: this.level.navigation,
    };

    const projectile: Projectile = new Projectile(data);
    this.level.app3D.add(projectile);
  }

  private startNavigator(navigator: Navigator): void {
    this.stopActiveNavigator();
    this.activeNavigator = navigator;
    navigator.start();
  }

  private stopActiveNavigator(): void {
    if (this.activeNavigator) {
      this.activeNavigator.stop();
    }
  }
}
