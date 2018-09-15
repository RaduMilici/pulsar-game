import { Vector, QuadTree, Shape, NavigatorTile, randomInt } from 'pulsar-pathfinding';
import { Vector3 } from 'three';
import { toVec3 } from 'util';
import Navigation from 'nav/Navigation';
import GameObject from 'entities/GameObject';
import CorridorLine from 'entities/level/corridor/CorridorLine';
import Floor from './Floor';
import Walls from './Walls';

export default class Room extends GameObject {
  quadTree: QuadTree;
  walls: Walls;
  tiles: NavigatorTile[] = [];

  readonly area: number;
  readonly floor: Floor;

  constructor(readonly shape: Shape, private readonly navigation: Navigation) {
    super();

    this.area = shape.boundingBox.area;
    this.floor = new Floor(shape);

    this.add(this.floor);
  }

  get centroid(): Vector {
    return this.shape.centroid;
  }

  get centroidV3(): Vector3 {
    return toVec3(this.centroid);
  }

  addNavData() {
    this.tiles = this.navigation.clearRoom(this);
  }

  randomTile(): NavigatorTile {
    const i: number = randomInt(0, this.tiles.length - 1);
    return this.tiles[i];
  }

  intersect(line: CorridorLine): Vector[] {
    const intersections: Vector[] = this.walls.intersect(line);
    return intersections.filter((i: Vector) => i !== null);
  }

  makeWalls(mstLines: CorridorLine[]): void {
    this.walls = new Walls(this.shape, mstLines);
    this.add(this.walls);
  }
}
