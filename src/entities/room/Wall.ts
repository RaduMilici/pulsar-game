import { Line, Shape as ShapePulsar } from 'pulsar-pathfinding';
import {
  Mesh,
  Vector2,
  Vector3,
  Matrix4,
  MeshBasicMaterial,
  DoubleSide,
} from 'three';
import { toVec3, makePlane } from '../../util';
import GameObject from '../GameObject';
import Walls from './Walls';
import CanvasTexture from './CanvasTexture';

export default class Wall extends GameObject {
  debugColor: string = '';
  private debugMaterial: MeshBasicMaterial;
  private mesh: Mesh;
  private readonly map: CanvasTexture;

  constructor(
    private readonly line: Line,
    private readonly mstLines: Line[],
    private readonly shape: ShapePulsar
  ) {
    super();
    this.map = new CanvasTexture({
      width: this.line.length,
      height: Walls.height,
    });
  }

  create(): void {
    this.debugMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      map: this.map,
      alphaTest: 0.9,
      transparent: true,
    });
    this.mesh = this.makeSolidWall();
    this.add(this.mesh);
    this.updateMatrixWorld(true);
  }

  addHole(uv: Vector2) {
    this.map.erase(uv);
  }

  private makeSolidWall(): Mesh {
    const wall: Mesh = makePlane({
      width: this.line.length + Walls.extraWidth,
      height: Walls.height,
    });
    wall.material = this.debugMaterial;
    this.setTransforms(wall);
    return wall;
  }

  private setTransforms(plane: Mesh): void {
    const centroidV3: Vector3 = toVec3(this.shape.centroid);
    const midpointV3: Vector3 = toVec3(this.line.midpoint);
    const matrix: Matrix4 = new Matrix4().makeTranslation(
      0,
      Walls.height / 2,
      0
    );

    plane.geometry.applyMatrix(matrix);
    plane.position.copy(midpointV3);
    plane.lookAt(centroidV3);
  }
}
