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
    this.clearRooms(level.rooms);
    this.clearDoors();
    this.clearCorridors();

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

  private onNavComplete(path: NavigatorTile[]) {
    path.forEach((tile: NavigatorTile) => {
      const cube = new Cube();
      const pos = new Vector({
        x: tile.position.x,
        y: tile.position.y,
      });
      cube.position.copy(toVec3(pos));
      this.level.add(cube);
    });
  }

  private clearRooms({ rooms }: Rooms): void {
    rooms.forEach((room: Room) => this.clearRoom(room));
  }

  private clearRoom(room: Room): void {
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
        //this.addCube(pos);
      }
    }
  }

  private clearDoors() {
    const levelCorridors = this.level.mst.lines.map(
      ({ a, b }: Line) => new CorridorLine(a, b)
    );
    const intersections: Vector[] = levelCorridors.reduce(
      (acc: Vector[], line: CorridorLine) => {
        const roomA = this.level.rooms.getRoomByCentroid(line.a);
        const roomB = this.level.rooms.getRoomByCentroid(line.b);

        acc.push(...roomA.intersect(line));
        acc.push(...roomB.intersect(line));

        return acc;
      },
      []
    );

    intersections.forEach((point: Vector) => {
      const tile: NavigatorTile = this.getTile(point);
      this.grid.obstacles.remove(tile);

      for (let i = 0; i < 9; i++) {
        const x: number = tile.position.x + Navigator.getColOffset(i);
        const y: number = tile.position.y + Navigator.getRowOffset(i);
        const neighborPoint: Vector = new Vector({ x, y });
        const neighborTile: NavigatorTile = this.grid.findTile(neighborPoint);

        if (!neighborTile) continue;

        this.grid.obstacles.remove(neighborTile);
        //this.addCube(neighborPoint);
      }
    });
  }

  private clearCorridors(): void {
    this.level.corridors.lines.forEach(({ a, b }: CorridorLine) => {
      const aTile: NavigatorTile = this.getTile(a);
      const bTile: NavigatorTile = this.getTile(b);

      this.grid.obstacles.remove(aTile);
      this.grid.obstacles.remove(bTile);

      const distance: number = aTile.position.distanceTo(bTile.position);

      for (let i = 0; i < distance; i++) {
        const lerp: Vector = aTile.position.lerp(bTile.position, i / distance);
        const lerpTile: NavigatorTile = this.getTile(lerp);
        this.grid.obstacles.remove(lerpTile);
        //this.addCube(lerp);
      }
    });
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
}
