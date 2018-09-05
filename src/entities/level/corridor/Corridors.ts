import { Shape } from 'pulsar-pathfinding';
import GameObject from '../../GameObject';
import Room from '../room/Room';
import Rooms from '../room/Rooms';
import CorridorLine from './CorridorLine';
import Side from '../../../types/side';
import Navigation from '../../../nav/Navigation';
import { doorWidth } from '../../../const/wall';

export default class Corridors extends GameObject {
  readonly lines: CorridorLine[] = [];
  private readonly navigation: Navigation;
  private static width: number = doorWidth / 3;

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
      this.navigation.clearCorridor(line);
      this.add(new Room(shape, this.navigation));
    });
  }
}
