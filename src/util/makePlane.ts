import { Mesh, PlaneGeometry } from 'three';

const makePlane = (width: number, height: number): Mesh => {
  const geometry: PlaneGeometry = new PlaneGeometry(width, height);
  return new Mesh(geometry);
};

export default makePlane;
