import {
  Grid,
  NavigatorTile,
  Navigator,
  Vector,
  size,
  row,
} from 'pulsar-pathfinding';
import Rooms from '../entities/room/Rooms';
import Room from '../entities/room/Room';
import Level from '../entities/Level';
import Cube from '../entities/Cube';
import { toVec3 } from '../util';
import CorridorLine from '../entities/corridors/CorridorLine';
import Corridors from '../entities/corridors/Corridors';
import { Line } from 'pulsar-pathfinding';

export default class Navigation {
  private grid: Grid;

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
    this.clearRoomObstacles(level.rooms);
    this.clearHoles();
    this.clearCorridors();

    const start: Room = this.level.rooms.rooms[0];
    const end: Room = this.level.rooms.rooms[this.level.rooms.rooms.length - 1];
    const startPoint: Vector = Navigation.roundedCoords(start.centroid);
    const endPoint: Vector = Navigation.roundedCoords(end.centroid);
    const startTile: NavigatorTile = this.grid.findTile(startPoint);
    const endTile: NavigatorTile = this.grid.findTile(endPoint);

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

  private static roundedCoords({ x, y }: Vector): Vector {
    return new Vector({ x: Math.round(x), y: Math.round(y) });
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

  private clearRoomObstacles({ rooms }: Rooms): void {
    rooms.forEach((room: Room) => this.clearRoom(room));
  }

  private clearRoom(room: Room): void {
    const startX: number = room.shape.boundingBox.topLeft.x + 1;
    const endX: number = room.shape.boundingBox.topRight.x - 1;
    const startY: number = room.shape.boundingBox.topLeft.y - 1;
    const endY: number = room.shape.boundingBox.bottomRight.y + 1;

    for (let x = startX; x < endX; x++) {
      for (let y = startY; y > endY; y--) {
        const point: Vector = new Vector({ x, y });
        const round: Vector = Navigation.roundedCoords(point);
        const tile: NavigatorTile = this.grid.findTile(round);

        if (!tile) continue;

        tile.isObstacle = false;
        this.grid.obstacles.remove(tile);
        //this.addCube(round);
      }
    }
  }

  private clearHoles() {
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
      const startPoint: Vector = Navigation.roundedCoords(point);
      const startTile: NavigatorTile = this.grid.findTile(startPoint);
      this.grid.obstacles.remove(startTile);
      startTile.isObstacle = false;

      for (let i = 0; i < 9; i++) {
        const x: number = startPoint.x + Navigation.getColOffset(i);
        const y: number = startPoint.y + Navigation.getRowOffset(i);
        const neighborPoint: Vector = new Vector({ x, y });
        const neighborTile: NavigatorTile = this.grid.findTile(neighborPoint);
        neighborTile.isObstacle = false;
        this.grid.obstacles.remove(neighborTile);
        //this.addCube(neighborPoint);
      }
    });
  }

  private clearCorridors(): void {
    this.level.corridors.lines.forEach(({ a, b }: CorridorLine) => {
      const aRound: Vector = Navigation.roundedCoords(a);
      const bRound: Vector = Navigation.roundedCoords(b);
      const aTile: NavigatorTile = this.grid.findTile(aRound);
      const bTile: NavigatorTile = this.grid.findTile(bRound);

      this.grid.obstacles.remove(aTile);
      this.grid.obstacles.remove(bTile);
      aTile.isObstacle = false;
      bTile.isObstacle = false;

      const distance: number = aRound.distanceTo(bRound);

      for (let i = 0; i < distance; i++) {
        const lerp: Vector = Navigation.roundedCoords(
          aRound.lerp(bRound, i / distance)
        );
        const lerpTile: NavigatorTile = this.grid.findTile(lerp);
        this.grid.obstacles.remove(lerpTile);
        lerpTile.isObstacle = false;
        //this.addCube(lerp);
      }
    });
  }

  private addCube(pos: Vector): void {
    const cube = new Cube();
    cube.position.copy(toVec3(pos));
    this.level.add(cube);
  }

  private static getRowOffset(iteration: number): number {
    /*
       iteration = 0, 1, or 2: [-1][-1][-1]
       iteration = 3, 4, or 5: [ 0][ 0][ 0]
       iteration = 6, 7, or 8: [+1][+1][+1]
     */
    return 9 + -Math.floor((32 - iteration) / 3);
  }

  private static getColOffset(iteration: number): number {
    /*
       iteration = 0, 1, or 2: [-1][ 0][+1]
       iteration = 3, 4, or 5: [-1][ 0][+1]
       iteration = 6, 7, or 8: [-1][ 0][+1]
     */
    return (iteration % 3) - 1;
  }
}
