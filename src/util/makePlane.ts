import { randomColor, size } from 'pulsar-pathfinding';
import { Mesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three';

const makePlane = ({ width, height }: size): Mesh => {
  const material: MeshBasicMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    color: randomColor(),
  });
  const geometry: PlaneGeometry = new PlaneGeometry(width, height);
  return new Mesh(geometry, material);
};

export default makePlane;
