import { Grid, NavigatorTile, Vector, size, BoundingBox, Navigator } from 'pulsar-pathfinding';
import Room from '../entities/level/room/Room';
import Level from '../entities/level/Level';
import Cube from '../entities/Cube';
import { toVec3, round } from '../util';
import CorridorLine from '../entities/level/corridor/CorridorLine';

export default class Navigation {
  readonly grid: Grid;

  constructor(private readonly level: Level) {
    const gridSize: size = {
      width: level.boundingBox.width,
      height: level.boundingBox.height,
    };

    this.grid = new Grid(gridSize);
    this.grid.onTileCreate = (tile: NavigatorTile) => (tile.isObstacle = true);
    this.grid.makeGrid();
  }

  clearRoom(room: Room): void {
    const smaller: BoundingBox = room.shape.boundingBox.clone();
    smaller.grow(-1);
    const startX: number = smaller.topLeft.x;
    const endX: number = smaller.topRight.x;
    const startY: number = smaller.topLeft.y;
    const endY: number = smaller.bottomRight.y;

    for (let x = startX; x <= endX; x++) {
      for (let y = startY; y >= endY; y--) {
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
      const neighbors: NavigatorTile[] = this.getNeighbors(lerpTile);

      neighbors.forEach((tile: NavigatorTile) => {
        this.grid.obstacles.remove(tile);
        //this.addCube(tile.position);
      });
    }
  }

  getTile({ x, y }: Vector): NavigatorTile | null {
    const rounded: Vector = new Vector({ x: round(x), y: round(y) });
    return this.grid.findTile(rounded);
  }

  private addCube(pos: Vector): void {
    const cube = new Cube();
    cube.position.copy(toVec3(pos));
    this.level.add(cube);
  }

  private getNeighbors(tile: NavigatorTile): NavigatorTile[] {
    const neighbors: NavigatorTile[] = [];

    for (let i = 0; i < 9; i++) {
      const x: number = tile.position.x + Navigator.getColOffset(i);
      const y: number = tile.position.y + Navigator.getRowOffset(i);
      const neighbor: NavigatorTile = this.getTile(new Vector({ x, y }));

      if (tile) {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }
}
