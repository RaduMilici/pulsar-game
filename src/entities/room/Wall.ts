import { Vector, Line } from 'pulsar-pathfinding';
import { Mesh, Vector3, Matrix4, Geometry } from "three";
import { toVec3, makePlane } from '../../util';
import GameObject from '../GameObject';
import Walls from './Walls';
import Cube from '../Cube'

export default class Wall extends GameObject {
  private readonly wallMesh: Mesh;

  constructor(
    private readonly line: Line,
    private readonly mstLines: Line[],
    private readonly centroid: Vector
  ) {
    super();
    this.makeMesh();
  }

  private intersectLines(): Vector[] {
    const intersections: Vector[] = [];

    for (let i = 0; i < this.mstLines.length; i++) {
      const line: Line = this.mstLines[i];

      if (this.line.intersects(line)) {
        intersections.push(this.line.intersectionPoint(line));
      }
    }

    return intersections;
  }

  private makeMesh(): void {
    const intersectionPoints: Vector[] = this.intersectLines();
    if (intersectionPoints.length !== 0) {
      //this.makeWallWithDoor(intersectionPoints);
      this.showIntersections(intersectionPoints);
    } else {
      this.makeSolidWall();
    }
  }

  private showIntersections(intersections: Vector[]): void {
    intersections.forEach((intersection: Vector) => {
      const cube: Cube = new Cube();
      cube.position.copy(toVec3(intersection));
      this.add(cube);
    });
  }

  private makeWallWithDoor(intersections: Vector[]): void {
    intersections.forEach((intersection: Vector) => {
      const length: number = this.line.a.distanceTo(intersection);
      const meshLength: number = length - Walls.doorWidth / 2;
      const mesh: Mesh = makePlane(meshLength, Walls.height);
      const midpoint: Vector = this.line.a.midpoint(intersection);
      this.setTransforms(mesh);
      mesh.position.copy(toVec3(midpoint));
      this.add(mesh);
    });
  }

  private makeSolidWall(): void {
    const mesh: Mesh = makePlane(this.line.length, Walls.height);
    this.setTransforms(mesh);
    this.add(mesh);
  }

  private setTransforms(plane: Mesh): void {
    const centroidV3: Vector3 = toVec3(this.centroid);
    const midpointV3: Vector3 = toVec3(this.line.midpoint);
    const matrix: Matrix4 = new Matrix4().makeTranslation(
      0,
      Walls.height / 2,
      0
    );

    plane.position.copy(midpointV3);
    plane.lookAt(centroidV3);
    plane.geometry.applyMatrix(matrix);
  }
}
