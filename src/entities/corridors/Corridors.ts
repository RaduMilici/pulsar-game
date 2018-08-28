import { Line, Vector, Shape } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import MST from './MST';
import Room from '../room/Room';
import Rooms from '../room/Rooms';
import CorridorLine from './CorridorLine';
import Walls from '../room/Walls';

export default class Corridors extends GameObject {
  readonly mstLines: Line[];
  private lines: CorridorLine[] = [];
  private static width: number = Walls.doorWidth / 4;

  constructor({ lines }: MST, private readonly rooms: Rooms) {
    super();
    this.mstLines = lines;
    this.lines = rooms.intersectCorridors(this);
    this.makeCorridors();
  }

  private makeCorridors(): void {
    this.lines.forEach((line: CorridorLine) => {
      const left: Line = line.getParallel(Corridors.width, -1);
      const right: Line = line.getParallel(Corridors.width, 1);

      const points: Vector[] = [left.a, left.b, right.a, right.b];
      const ccw: Vector[] = Vector.ArrangePointsCCW(points);

      const shape: Shape = new Shape(ccw);
      const room: Room = new Room(shape);
      //room.makeWalls(this.lines);
      this.add(room);
    });
  }
}
