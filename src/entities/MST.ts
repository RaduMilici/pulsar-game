import { Vector, Triangulation, Line as LinePulsar, Hull } from 'pulsar-pathfinding';
import GameObject from './GameObject';
import Rooms from './level/room/Rooms';
import { toVec3 } from '../util/index';
import { Geometry, Line, LineBasicMaterial } from 'three';
import CorridorLine from './level/corridor/CorridorLine';

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
    //this.lines = this.makeBrokenLines(this.triangulation.MST.lines);
    this.lines = this.triangulation.MST.lines.map(({ a, b }: LinePulsar) => new CorridorLine(a, b));
    //this.lines = this.duplicateLines(this.triangulation.MST.lines);
    //this.lines = this.hull.lines;

    //this.add(...this.makeDebugLines(this.level.boundingBox.lines));
    //this.add(...this.makeDebugLines(this.lines));
  }

  private duplicateLines(lines: LinePulsar[]): LinePulsar[] {
    return lines.reduce((accumulator: LinePulsar[], line: LinePulsar) => {
      const perpendicularA: {
        left: Vector;
        right: Vector;
      } = line.a.perpendicular();
      const perpendicularB: {
        left: Vector;
        right: Vector;
      } = line.b.perpendicular();

      const leftA: Vector = line.a.add(perpendicularA.left.normalize());
      const leftB: Vector = line.b.add(perpendicularB.left.normalize());

      const leftLine: LinePulsar = new LinePulsar(leftA, leftB);

      accumulator.push(leftLine, line);
      return accumulator;
    }, []);
  }

  private makeBrokenLines(lines: LinePulsar[]): LinePulsar[] {
    const broken: LinePulsar[] = [];

    lines.forEach((line: LinePulsar) => {
      broken.push(...MST.breakLine(line));
    });

    return broken;
  }

  private static breakLine(line: LinePulsar): LinePulsar[] {
    const offscreenX = new Vector({ x: -Number.MAX_SAFE_INTEGER, y: line.a.y });
    const offscreenY = new Vector({ x: line.b.x, y: -Number.MAX_SAFE_INTEGER });

    const intersectLine1: LinePulsar = new LinePulsar(offscreenX, line.a);
    const intersectLine2: LinePulsar = new LinePulsar(offscreenY, line.b);

    const intersect: Vector = intersectLine1.intersectionPoint(intersectLine2);

    const line1: LinePulsar = new LinePulsar(line.a, intersect);
    const line2: LinePulsar = new LinePulsar(line.b, intersect);

    return [line1, line2];
  }

  private makeDebugLines(lines: LinePulsar[]): Line[] {
    return lines.map(({ a, b }: LinePulsar) => {
      const geometry: Geometry = new Geometry();
      geometry.vertices.push(toVec3(a, 0.1), toVec3(b, 0.1));
      return new Line(geometry, new LineBasicMaterial());
    });
  }
}