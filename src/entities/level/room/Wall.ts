import { Line, Shape as ShapePulsar, size, Vector } from 'pulsar-pathfinding';
import { WALL_HEIGHT, WALL_EXTRA_WIDTH, DOOR_WIDTH, DOOR_FRAME_WIDTH } from 'const';
import { Mesh, Vector2, Vector3, Matrix4, MeshBasicMaterial, DoubleSide } from 'three';
import { toVec3, makePlane } from 'util';
import GameObject from 'entities/GameObject';
import CanvasTexture from './CanvasTexture';

export default class Wall extends GameObject {
  private debugMaterial: MeshBasicMaterial;
  private mesh: Mesh;

  private readonly map: CanvasTexture;

  private static holeSize: size = {
    width: CanvasTexture.getPixelMultiplier(DOOR_WIDTH),
    height: CanvasTexture.getPixelMultiplier(WALL_HEIGHT),
  };

  private static frameSize: size = {
    width: Wall.holeSize.width + CanvasTexture.getPixelMultiplier(DOOR_FRAME_WIDTH),
    height: Wall.holeSize.height + CanvasTexture.getPixelMultiplier(DOOR_FRAME_WIDTH),
  };

  constructor(readonly line: Line, private mstLines: Line[], private shape: ShapePulsar) {
    super();

    this.map = new CanvasTexture({
      width: this.line.length,
      height: WALL_HEIGHT,
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
      width: this.line.length + WALL_EXTRA_WIDTH,
      height: WALL_HEIGHT,
    });
    wallMesh.material = this.debugMaterial;
    this.setTransforms(wallMesh);
    return wallMesh;
  }

  private setTransforms(plane: Mesh): void {
    const centroidV3: Vector3 = toVec3(this.shape.centroid);
    const midpointV3: Vector3 = toVec3(this.line.midpoint);
    const matrix: Matrix4 = new Matrix4().makeTranslation(0, WALL_HEIGHT / 2, 0);

    plane.geometry.applyMatrix(matrix);
    plane.position.copy(midpointV3);
    plane.lookAt(centroidV3);
  }
}
