import { Line, Shape as ShapePulsar, size, Vector } from 'pulsar-pathfinding';
import { toVec3, makePlane } from '../../util';
import GameObject from '../GameObject';
import Walls from './Walls';
import CanvasTexture from './CanvasTexture';
import {
  Mesh,
  Vector2,
  Vector3,
  Matrix4,
  MeshBasicMaterial,
  DoubleSide,
} from 'three';

export default class Wall extends GameObject {
  private debugMaterial: MeshBasicMaterial;
  private mesh: Mesh;
  private readonly map: CanvasTexture;
  private readonly holeSize: size;
  private readonly frameSize: size;

  constructor(
    private readonly line: Line,
    private readonly mstLines: Line[],
    private readonly shape: ShapePulsar
  ) {
    super();

    this.holeSize = {
      width: CanvasTexture.getPixelMultiplier(Walls.doorWidth),
      height: CanvasTexture.getPixelMultiplier(Walls.height),
    };

    this.frameSize = {
      width:
        this.holeSize.width +
        CanvasTexture.getPixelMultiplier(Walls.doorFrameWidth),
      height:
        this.holeSize.height +
        CanvasTexture.getPixelMultiplier(Walls.doorFrameWidth),
    };

    this.map = new CanvasTexture({
      width: this.line.length,
      height: Walls.height,
    });

    this.create();
  }

  addHole(uv: Vector2) {
    this.map.drawRect(uv, this.frameSize);
    this.map.erase(uv, this.holeSize);
  }

  intersect(line: Line): Vector {
    return line.intersects(this.line)
      ? line.intersectionPoint(this.line)
      : null;
  }

  private create(): void {
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
