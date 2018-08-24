import { Vector, Line, Shape as ShapePulsar } from 'pulsar-pathfinding';
import {
  Mesh,
  Vector3,
  Matrix4,
  ExtrudeGeometry,
  Shape,
  MeshBasicMaterial,
  DoubleSide
} from 'three';
import { toVec3, makePlane } from '../../util';
import GameObject from '../GameObject';
import Walls from './Walls';
import Cube from '../Cube';
import CanvasTexture from './CanvasTexture';

export default class Wall extends GameObject {
  debugColor: string = '';

  private readonly intersections: Vector[] = [];
  private debugMaterial: MeshBasicMaterial;

  constructor(
    private readonly line: Line,
    private readonly mstLines: Line[],
    private readonly shape: ShapePulsar
  ) {
    super();
    this.intersections = this.intersectMstLines();
  }

  create(): void {
    const map = new CanvasTexture();
    this.debugMaterial = new MeshBasicMaterial({ color: 0xffffff, wireframe: false, side: DoubleSide, map });
    this.makeMesh();
  }

  private intersectMstLines(): Vector[] {
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
    if (this.intersections.length !== 0) {
      this.makeWallWithDoor();
      this.showIntersections();
    } else {
      this.makeSolidWall();
    }
  }

  private showIntersections(): void {
    this.intersections.forEach((intersection: Vector) => {
      const cube: Cube = new Cube();
      cube.position.copy(toVec3(intersection));
      this.add(cube);
    });
  }

  private makeWallWithDoor(): void {
  }

  /*private makeWallWithDoor(): void {
    const shape: Shape = new Shape();

    shape.lineTo(0, Walls.height);

    this.intersections.forEach((intersection: Vector, index: number) => {
      //const distanceA: number = this.line.a.distanceTo(intersection);
      //const distanceB: number = this.line.b.distanceTo(intersection);
      if (index > 0) return;
      //console.log(index)
      const distance = this.line.a.distanceTo(intersection);
      console.log(distance)

      const a: number = distance - Walls.doorWidth / 2;
      const b: number = distance + Walls.doorWidth / 2;

      const aClamp: number = clamp(a, 0, this.line.length);
      const bClamp: number = clamp(b, 0, this.line.length);

      shape.lineTo(aClamp, Walls.height);
      shape.lineTo(aClamp, 0);
      shape.lineTo(bClamp, 0);
      shape.lineTo(bClamp, Walls.height);
    });

    shape.lineTo(this.line.length, Walls.height);
    shape.lineTo(this.line.length, 0);

    const mesh: Mesh = this.makeMeshFromShape(shape);
    this.add(mesh);
  }*/

  private makeSolidWall(): void {
    const wall: Mesh = makePlane({ width: this.line.length, height: Walls.height });
    wall.material = this.debugMaterial;
    this.setTransforms(wall/*, this.line.length*/);
    this.add(wall);
  }

  private makeMeshFromShape(shape: Shape): Mesh {
    const geometry = new ExtrudeGeometry(shape, {
      depth: Walls.thickness,
      bevelEnabled: false,
    });
    const mesh: Mesh = new Mesh(geometry, this.debugMaterial);

    this.setTransforms(mesh/*, this.line.length*/);
    return mesh;
  }

  private setTransforms(plane: Mesh/*, width: number*/): void {
    const centroidV3: Vector3 = toVec3(this.shape.centroid);
    const midpointV3: Vector3 = toVec3(this.line.midpoint);
    //const matrix: Matrix4 = new Matrix4().makeTranslation(-width, 0, 0);
    const matrix: Matrix4 = new Matrix4().makeTranslation(0, Walls.height / 2, 0);

    plane.geometry.applyMatrix(matrix);
    plane.position.copy(midpointV3);
    plane.lookAt(centroidV3);
  }
}
