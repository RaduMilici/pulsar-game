import { Object3D, Vector3, Quaternion } from 'three';

export default class Gyroscope extends Object3D {
  updateMatrixWorld(force: boolean) {
    const translationObject = new Vector3();
    const quaternionObject = new Quaternion();
    const scaleObject = new Vector3();
    const translationWorld = new Vector3();
    const quaternionWorld = new Quaternion();
    const scaleWorld = new Vector3();

    this.matrixAutoUpdate && this.updateMatrix();

    // update matrixWorld

    if (this.matrixWorldNeedsUpdate || force) {
      if (this.parent !== null) {
        this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);

        this.matrixWorld.decompose(translationWorld, quaternionWorld, scaleWorld);
        this.matrix.decompose(translationObject, quaternionObject, scaleObject);

        this.matrixWorld.compose(
          translationWorld,
          quaternionObject,
          scaleWorld
        );
      } else {
        this.matrixWorld.copy(this.matrix);
      }

      this.matrixWorldNeedsUpdate = false;

      force = true;
    }

    // update children

    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }
}
