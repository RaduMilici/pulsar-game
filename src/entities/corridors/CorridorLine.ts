import { Line, Vector, contains } from 'pulsar-pathfinding';

export default class CorridorLine extends Line {
  readonly intersections: Vector[] = [];

  get hasIntersections(): boolean {
    return this.intersections.length !== 0;
  }

  getParallel(distance: number, side: number): Line {
    let dx: number = this.a.x - this.b.x;
    let dy: number = this.a.y - this.b.y;
    const dist: number = Math.sqrt(dx * dx + dy * dy) / 2;

    dx *= (side * distance) / dist;
    dy *= (side * distance) / dist;

    const pA = new Vector({ x: this.a.x + dy, y: this.a.y - dx });
    const pB = new Vector({ x: this.b.x + dy, y: this.b.y - dx });

    return new Line(pA, pB);
  }

  addIntersections(points: Vector[]): void {
    points.forEach((p: Vector) => this.add(p));
  }

  private add(point: Vector): void {
    const index: number = this.intersections.findIndex(
      (intersection: Vector) => {
        return point.equals(intersection);
      }
    );

    if (index === -1) {
      this.intersections.push(point);
    }
  }
}
