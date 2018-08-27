import { Scene } from 'three';

export default class Dispose {
  constructor(scene: Scene) {
    Dispose.hierarchy(scene, Dispose.node);
  }

  private static hierarchy(node: any, callback: any) {
    for (let i = node.children.length - 1; i >= 0; i--) {
      const child = node.children[i];
      Dispose.hierarchy(child, callback);
      callback(child);
    }
  }

  private static node(node: any) {
    if (node.geometry) {
      node.geometry.dispose();
    }

    if (node.material) {
      if (node.material.map) node.material.map.dispose();
      if (node.material.lightMap) node.material.lightMap.dispose();
      if (node.material.bumpMap) node.material.bumpMap.dispose();
      if (node.material.normalMap) node.material.normalMap.dispose();
      if (node.material.specularMap) node.material.specularMap.dispose();
      if (node.material.envMap) node.material.envMap.dispose();

      node.material.dispose();
    }
  }
}
