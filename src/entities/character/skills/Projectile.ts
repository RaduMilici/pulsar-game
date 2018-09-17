import { Object3D, Vector2, Vector3 } from 'three';
import { NavigatorTile, Vector } from 'pulsar-pathfinding';
import { projectileData, moveSplineData } from 'types';
import Mobile from 'entities/Mobile';
import Cube from 'entities/Cube';
import mobileData from 'types/mobileData';

export default class Projectile extends Mobile {
  private readonly begin: Vector3;
  private readonly mesh: Object3D;
  private readonly onComplete: (projectile: Projectile) => void;
  private end: Vector3;

  constructor({ begin, end, speed, navigation, onComplete, mesh = new Cube() }: projectileData) {
    const mobileData: mobileData = {
      navigation,
      speed,
      navStopDistance: 0,
      position: begin,
    };
    super(mobileData);

    this.begin = begin;
    this.end = end;
    this.onComplete = onComplete || (() => {});
    this.mesh = mesh;
    app3D.add(this.mesh, this);
    this.position.copy(this.begin);
  }

  start() {
    const data: moveSplineData = {
      path: this.getPath(),
      speed: this.speed,
      mobile: this,
      onComplete: () => {
        this.onComplete(this);
      },
    };

    this.moveToUsingSpline(data);
  }

  private getPath(): Vector2[] {
    const begin: Vector2 = new Vector2(this.begin.x, this.begin.z);
    const end: Vector2 = new Vector2(this.end.x, this.end.z);
    const path: Vector2[] = [begin];
    const distance = begin.distanceTo(end);
    let hitWall: boolean = false;

    for (let i = 0; i < distance; i++) {
      const pos: Vector2 = begin.clone().lerp(end, i / distance);
      const posVec: Vector = new Vector({ x: pos.x, y: pos.y });
      const tile: NavigatorTile | null = this.navigation.getTile(posVec);

      if (tile && !tile.isObstacle) {
        path.push(pos);
      } else {
        // No need to continue beyond an obstacle.
        hitWall = true;
        break;
      }
    }

    if (!hitWall) {
      /*
      * Only add the last point if there was a clear path to it.
      * Otherwise, projectile would pass through obstacles.
      */
      path.push(end);
    }

    return path;
  }
}
