import {
  Grid,
  NavigatorTile,
  Navigator,
  Vector,
  size,
  Line,
  BoundingBox,
  immutableObjectSort,
} from 'pulsar-pathfinding';
import Rooms from '../entities/room/Rooms';
import Room from '../entities/room/Room';
import Level from '../entities/Level';
import Cube from '../entities/Cube';
import { toVec3 } from '../util';
import CorridorLine from '../entities/corridors/CorridorLine';

export default class Navigation {
  private readonly grid: Grid;

  constructor(private readonly level: Level) {
    const gridSize: size = {
      width: level.boundingBox.width,
      height: level.boundingBox.height,
    };

    this.grid = new Grid(gridSize);
    this.grid.onTileCreate = (tile: NavigatorTile) => {
      tile.isObstacle = true;
    };
    this.grid.makeGrid();
  }

  clearRoom(room: Room): void {
    const smaller: BoundingBox = room.shape.boundingBox.clone();
    smaller.grow(-1);
    const startX: number = smaller.topLeft.x;
    const endX: number = smaller.topRight.x;
    const startY: number = smaller.topLeft.y;
    const endY: number = smaller.bottomRight.y;

    for (let x = startX; x < endX; x++) {
      for (let y = startY; y > endY; y--) {
        const pos: Vector = new Vector({ x, y });
        const tile: NavigatorTile = this.getTile(pos);

        if (!tile) continue;

        this.grid.obstacles.remove(tile);
        //this.addCube(tile.position);
      }
    }
  }

  clearCorridor({ a, b }: CorridorLine): void {
    const aTile: NavigatorTile = this.getTile(a);
    const bTile: NavigatorTile = this.getTile(b);

    this.grid.obstacles.remove(aTile);
    this.grid.obstacles.remove(bTile);

    const distance: number = aTile.position.distanceTo(bTile.position);

    for (let i = 0; i < distance; i++) {
      const lerp: Vector = aTile.position.lerp(bTile.position, i / distance);
      const lerpTile: NavigatorTile = this.getTile(lerp);
      this.grid.obstacles.remove(lerpTile);
      //this.addCube(lerpTile.position);
    }
  }

  debugPathfinding() {
    const start: Room = this.level.rooms.rooms[0];
    const end: Room = this.level.rooms.rooms[this.level.rooms.rooms.length - 1];
    const startTile: NavigatorTile = this.getTile(start.centroid);
    const endTile: NavigatorTile = this.getTile(end.centroid);

    const nav: Navigator = new Navigator(
      this.grid,
      startTile,
      endTile,
      undefined,
      this.onNavComplete.bind(this)
    );
    console.time('nav');
    nav.start();
    console.timeEnd('nav');
  }

  private getTile({ x, y }: Vector): NavigatorTile {
    const rounded: Vector = new Vector({ x: Math.round(x), y: Math.round(y) });
    return this.grid.findTile(rounded);
  }

  private addCube(pos: Vector): void {
    const cube = new Cube();
    cube.position.copy(toVec3(pos));
    this.level.add(cube);
  }

  private onNavComplete(path: NavigatorTile[]) {
    path.forEach((tile: NavigatorTile) => {
      const cube = new Cube('white');
      const pos = new Vector({
        x: tile.position.x,
        y: tile.position.y,
      });
      cube.position.copy(toVec3(pos));
      this.level.add(cube);
    });
  }

  private onNavExplore(tile: NavigatorTile) {
    const cube = new Cube('blue');
    const pos = new Vector(tile.position);
    cube.position.copy(toVec3(pos));
    this.level.add(cube);
  }
}
