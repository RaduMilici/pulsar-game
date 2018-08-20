import { Matrix4, Object3D } from "three";

const addWorldToLocal = (parent: Object3D, child: Object3D) => {
  parent.updateMatrixWorld(true);
  child.applyMatrix(new Matrix4().getInverse(parent.matrixWorld));
  parent.add(child);
};

export default addWorldToLocal;