import { Line, Shape as ShapePulsar, size, Vector } from 'pulsar-pathfinding';
import { toVec3, makePlane } from '../../../util/index';
import { GameObject } from 'entities';
import { wall } from 'const';
import { Mesh, Vector2, Vector3, Matrix4, MeshBasicMaterial, DoubleSide } from 'three';
import CanvasTexture from './CanvasTexture';

export default class Wall extends GameObject {
  private debugMaterial: MeshBasicMaterial;
  private mesh: Mesh;

  private readonly map: CanvasTexture;

  private static holeSize: size = {
    width: CanvasTexture.getPixelMultiplier(wall.doorWidth),
    height: CanvasTexture.getPixelMultiplier(wall.height),
  };

  private static frameSize: size = {
    width: Wall.holeSize.width + CanvasTexture.getPixelMultiplier(wall.doorFrameWidth),
    height: Wall.holeSize.height + CanvasTexture.getPixelMultiplier(wall.doorFrameWidth),
  };

  constructor(readonly line: Line, private mstLines: Line[], private shape: ShapePulsar) {
    super();

    this.map = new CanvasTexture({
      width: this.line.length,
      height: wall.height,
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
    const wallMesh: Mesh = makePlane({
      width: this.line.length + wall.extraWidth,
      height: wall.height,
    });
    wallMesh.material = this.debugMaterial;
    this.setTransforms(wall);
    return wall;
  }

  private setTransforms(plane: Mesh): void {
    const centroidV3: Vector3 = toVec3(this.shape.centroid);
    const midpointV3: Vector3 = toVec3(this.line.midpoint);
    const matrix: Matrix4 = new Matrix4().makeTranslation(0, wall.height / 2, 0);

    plane.geometry.applyMatrix(matrix);
    plane.position.copy(midpointV3);
    plane.lookAt(centroidV3);
  }
}
