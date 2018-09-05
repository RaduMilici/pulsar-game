import { Vector2, Vector3 } from 'three';
import GameObject from '../GameObject';
import Navigation from '../../nav/Navigation';
import MoveSpline from '../../components/MoveSpline';
import Cube from '../../entities/Cube';
import { NavigatorTile, Vector } from 'pulsar-pathfinding';
import projectileData from '../../types/projectileData';
import moveSplineData from '../../types/moveSplineData';

export default class Projectile extends GameObject {
  private readonly begin: Vector3;
  private readonly speed: number;
  private readonly onEndPath: (projectile: Projectile) => void;

  private moveSpline: MoveSpline;
  private end: Vector3;
  private navigation: Navigation;
  private mesh: Cube = new Cube();

  constructor({ begin, end, speed, navigation, onEndPath }: projectileData) {
    super();

    this.begin = begin;
    this.end = end;
    this.speed = speed;
    this.navigation = navigation;
    this.onEndPath = onEndPath || (() => {});

    this.add(this.mesh);
    this.position.copy(this.begin);
  }

  start() {
    const data: moveSplineData = {
      path: this.getPath(),
      speed: this.speed,
      mobile: this,
      updater: this.updater,
      onFinish: () => {
        this.onEndPath(this);
      },
    };
    this.moveSpline = new MoveSpline(data);
    this.updater.add(this.moveSpline);
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
        hitWall = true;
        break;
      }
    }

    if (!hitWall) {
      path.push(end);
    }

    return path;
  }
}
