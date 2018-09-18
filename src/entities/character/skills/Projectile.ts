import { Object3D, Vector2, Vector3 } from 'three';
import { NavigatorTile, Vector } from 'pulsar-pathfinding';
import { projectileData, moveSplineData, moveSplineStep } from 'types';
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
      mobile: this,
      onComplete: () => {
        this.onComplete(this);
      },
    };

    this.moveToUsingSpline(data);
  }

  private getPath(): moveSplineStep[] {
    const begin: Vector2 = new Vector2(this.begin.x, this.begin.z);
    const end: Vector2 = new Vector2(this.end.x, this.end.z);
    const beginTile: NavigatorTile = this.navigation.getTile(begin);
    const endTile: NavigatorTile = this.navigation.getTile(end);
    const beginStep: moveSplineStep = { position: begin, tile: beginTile };
    const endStep: moveSplineStep = { position: end, tile: endTile };
    const path: moveSplineStep[] = [beginStep];
    const distance = begin.distanceTo(end);
    let hitWall: boolean = false;

    for (let i = 0; i < distance; i++) {
      const position: Vector2 = begin.clone().lerp(end, i / distance);
      const posVec: Vector = new Vector({ x: position.x, y: position.y });
      const tile: NavigatorTile | null = this.navigation.getTile(posVec);

      if (tile && !tile.isObstacle) {
        path.push({ position, tile });
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
      path.push(endStep);
    }

    return path;
  }
}
