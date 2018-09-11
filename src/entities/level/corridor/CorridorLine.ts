import { Line, Vector } from 'pulsar-pathfinding';
import { Side } from 'interfaces';

export default class CorridorLine extends Line {
  readonly intersections: Vector[] = [];

  get hasIntersections(): boolean {
    return this.intersections.length !== 0;
  }

  get slope(): number {
    return (this.b.y - this.a.y) / (this.b.x - this.a.x);
  }

  getParallel(distance: number, side: Side): CorridorLine {
    let dx: number = this.a.x - this.b.x;
    let dy: number = this.a.y - this.b.y;
    const dist: number = Math.sqrt(dx * dx + dy * dy) / 2;

    dx *= (side * distance) / dist;
    dy *= (side * distance) / dist;

    const pA = new Vector({ x: this.a.x + dy, y: this.a.y - dx });
    const pB = new Vector({ x: this.b.x + dy, y: this.b.y - dx });

    return new CorridorLine(pA, pB);
  }

  addIntersections(points: Vector[]): void {
    this.intersections.push(...points);
  }
}
