import { randomColor } from 'pulsar-pathfinding';
import {
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  FrontSide,
  DoubleSide,
} from 'three';

const makePlane = (width: number, height: number): Mesh => {
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    color: randomColor(),
  });
  const geometry: PlaneGeometry = new PlaneGeometry(width, height);
  return new Mesh(geometry, material);
};

export default makePlane;
