import { Line, Shape } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import MST from '../MST';
import Room from '../room/Room';
import Rooms from '../room/Rooms';
import CorridorLine from './CorridorLine';
import Walls from '../room/Walls';
import Side from '../../types/side';
import Navigation from '../../nav/Navigation';

export default class Corridors extends GameObject {
  readonly lines: CorridorLine[] = [];
  private readonly navigation: Navigation;
  private static width: number = Walls.doorWidth / 4;

  constructor(private readonly rooms: Rooms) {
    super();
    this.navigation = rooms.navigation;
    this.lines = rooms.intersectCorridors();
    this.makeCorridors();
  }

  private makeCorridors(): void {
    this.lines.forEach((line: CorridorLine) => {
      const left: CorridorLine = line.getParallel(Corridors.width, Side.Left);
      const right: CorridorLine = line.getParallel(Corridors.width, Side.Right);
      const shape: Shape = new Shape([left.a, left.b, right.a, right.b]);
      //[left, line, right].forEach((l: CorridorLine) => this.navigation.clearCorridor(l));
      this.navigation.clearCorridor(line);
      this.add(new Room(shape, this.navigation));
    });
  }
}
