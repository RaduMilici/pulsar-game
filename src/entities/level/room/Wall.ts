import { Line, Shape as ShapePulsar, size, Vector } from 'pulsar-pathfinding';
import { toVec3, makePlane } from '../../../util/index';
import GameObject from '../../GameObject';
import { height, doorFrameWidth, doorWidth, extraWidth } from '../../../const/wall';
import CanvasTexture from './CanvasTexture';
import { Mesh, Vector2, Vector3, Matrix4, MeshBasicMaterial, DoubleSide } from 'three';

export default class Wall extends GameObject {
  private debugMaterial: MeshBasicMaterial;
  private mesh: Mesh;

  private readonly map: CanvasTexture;

  private static holeSize: size = {
    width: CanvasTexture.getPixelMultiplier(doorWidth),
    height: CanvasTexture.getPixelMultiplier(height),
  };

  private static frameSize: size = {
    width: Wall.holeSize.width + CanvasTexture.getPixelMultiplier(doorFrameWidth),
    height: Wall.holeSize.height + CanvasTexture.getPixelMultiplier(doorFrameWidth),
  };

  constructor(readonly line: Line, private mstLines: Line[], private shape: ShapePulsar) {
    super();

    this.map = new CanvasTexture({
      width: this.line.length,
      height,
    });

    this.create();
  }

  addHole(uv: Vector2) {
    //this.map.drawRect(uv, Wall.frameSize);
    this.map.erase(uv, Wall.holeSize);
  }

  intersect(line: Line): Vector | null {
    return line.intersects(this.line) ? line.intersectionPoint(this.line) : null;
  }

  private create(): void {
    this.debugMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      map: this.map,
      alphaTest: 0.9,
      transparent: true,
    });
    this.mesh = this.makeMesh();
    this.add(this.mesh);
    this.updateMatrixWorld(true);
  }

  private makeMesh(): Mesh {
    const wall: Mesh = makePlane({
      width: this.line.length + extraWidth,
      height,
    });
    wall.material = this.debugMaterial;
    this.setTransforms(wall);
    return wall;
  }

  private setTransforms(plane: Mesh): void {
    const centroidV3: Vector3 = toVec3(this.shape.centroid);
    const midpointV3: Vector3 = toVec3(this.line.midpoint);
    const matrix: Matrix4 = new Matrix4().makeTranslation(0, height / 2, 0);

    plane.geometry.applyMatrix(matrix);
    plane.position.copy(midpointV3);
    plane.lookAt(centroidV3);
  }
}
