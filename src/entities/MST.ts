import { Vector, Triangulation, Line as LinePulsar, Hull } from 'pulsar-pathfinding';
import { toVec3 } from 'util';
import { Geometry, Line, LineBasicMaterial } from 'three';
import CorridorLine from 'entities/level/corridor/CorridorLine';
import Rooms from 'entities/level/room/Rooms';
import GameObject from 'entities/GameObject';

export default class MST extends GameObject {
  readonly lines: CorridorLine[];
  private readonly points: Vector[] = [];
  private readonly triangulation: Triangulation;
  private readonly hull: Hull;

  constructor(private readonly rooms: Rooms) {
    super();

    this.points = rooms.centroids;
    this.triangulation = new Triangulation(this.points);
    this.triangulation.start();
    this.triangulation.MST.start();
    this.hull = new Hull(this.triangulation);
    this.hull.start();
    this.lines = this.triangulation.MST.lines.map(({ a, b }: LinePulsar) => new CorridorLine(a, b));
    //this.add(...this.makeDebugLines(this.lines));
  }

  private makeDebugLines(lines: LinePulsar[]): Line[] {
    return lines.map(({ a, b }: LinePulsar) => {
      const geometry: Geometry = new Geometry();
      geometry.vertices.push(toVec3(a, 0.1), toVec3(b, 0.1));
      return new Line(geometry, new LineBasicMaterial());
    });
  }
}
