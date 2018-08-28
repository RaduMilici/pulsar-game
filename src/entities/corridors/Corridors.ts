import { Line, Vector, Shape } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import MST from './MST';
import Room from '../room/Room';
import Rooms from '../room/Rooms';
import CorridorLine from './CorridorLine';
import Walls from '../room/Walls';

export default class Corridors extends GameObject {
  readonly mstLines: Line[];
  private readonly lines: CorridorLine[] = [];
  private static width: number = Walls.doorWidth / 4;

  constructor({ lines }: MST, private readonly rooms: Rooms) {
    super();
    this.mstLines = lines;
    this.lines = rooms.intersectCorridors(this);
    this.makeCorridors();
  }

  private makeCorridors(): void {
    this.lines.forEach((line: CorridorLine) => {
      if (line.intersections.length !== 2) return;

      const a: Vector = line.intersections[0];
      const b: Vector = line.intersections[1];
      const corridorLine = new CorridorLine(a, b);

      const left: Line = corridorLine.getParallel(Corridors.width, -1);
      const right: Line = corridorLine.getParallel(Corridors.width, 1);

      const shape: Shape = new Shape([left.a, left.b, right.a, right.b]);
      const room: Room = new Room(shape);

      room.makeWalls(this.lines);
      this.add(room);
    });
  }
}
