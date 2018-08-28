import { Line, Vector } from 'pulsar-pathfinding';
import GameObject from '../GameObject';
import MST from './MST';
import Rooms from '../room/Rooms';
import CorridorLine from './CorridorLine';

export default class Corridors extends GameObject {
  readonly mstLines: Line[];
  private lines: CorridorLine[] = [];

  constructor({ lines }: MST, private readonly rooms: Rooms) {
    super();
    this.mstLines = lines;
    //this.lines = mst.lines.map(({ a, b }: Line) => new CorridorLine(a, b));
    this.lines = rooms.intersectCorridors(this);
    //this.makeCorridors();
    console.log(this.lines);
  }

  /*private makeCorridors(): void {
    this.lines.forEach((line: CorridorLine) => {

    });
  }*/
}
