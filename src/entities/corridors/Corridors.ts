import { Line, Shape } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import MST from './MST';
import Room from '../room/Room';
import Rooms from '../room/Rooms';
import CorridorLine from './CorridorLine';
import Walls from '../room/Walls';
import Side from '../../types/side';

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
      const left: Line = line.getParallel(Corridors.width, Side.Left);
      const right: Line = line.getParallel(Corridors.width, Side.Right);
      const shape: Shape = new Shape([left.a, left.b, right.a, right.b]);
      this.add(new Room(shape));
    });
  }
}
