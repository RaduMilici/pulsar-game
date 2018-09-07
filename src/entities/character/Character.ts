import { Vector3, Object3D } from 'three';
import { toVector } from 'util';
import { Vector, NavigatorTile } from 'pulsar-pathfinding';
import Navigator from 'nav/Navigator';
import Cone from 'entities/Cone';
import Level from 'entities/level/Level';
import GameObject from 'entities/GameObject';

export default class Character extends GameObject {
  readonly mesh: Object3D;
  private activeNavigator: Navigator;

  constructor(readonly level: Level) {
    super();
    this.mesh = new Cone();
    this.add(this.mesh);
  }

  faceTo({ x, z }: Vector3): void {
    this.stopNavigator();
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
      this
    );

    this.startNavigator(navigator);
  }

  private startNavigator(navigator: Navigator): void {
    this.stopNavigator();
    this.activeNavigator = navigator;
    navigator.start();
  }

  private stopNavigator(): void {
    if (this.activeNavigator) {
      this.activeNavigator.stop();
    }
  }
}
