import { Object3D, Vector2, Vector3 } from 'three';
import { NavigatorTile, Vector } from 'pulsar-pathfinding';
import { projectileData, moveSplineData } from 'types';
import Navigation from 'nav/Navigation';
import MoveSpline from 'components/MoveSpline.component';
import GameObject from 'entities/GameObject';
import Cube from 'entities/Cube';

export default class Projectile extends GameObject {
  private readonly begin: Vector3;
  private readonly speed: number;
  private readonly mesh: Object3D;
  private readonly onComplete: (projectile: Projectile) => void;

  private moveSpline: MoveSpline;
  private end: Vector3;
  private navigation: Navigation;

  constructor({ begin, end, speed, navigation, onComplete, mesh = new Cube() }: projectileData) {
    super();

    this.begin = begin;
    this.end = end;
    this.speed = speed;
    this.navigation = navigation;
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
    this.moveSpline = new MoveSpline(data);
    app3D.add(this.moveSpline);
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
