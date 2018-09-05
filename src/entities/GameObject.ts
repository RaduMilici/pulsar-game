import { Object3D, Scene } from 'three';
import { Entity, Updater, Component } from 'pulsar-pathfinding';
import App3D from '../App3D/App3D';

export default class GameObject extends Object3D implements Entity {
  static app3D: App3D;
  static scene: Scene;
  updater: Updater;
  readonly components: Component[] = [];
  private readonly threeAdd: (...object: Object3D[]) => void;
  private readonly threeRemove: (...object: Object3D[]) => void;

  constructor() {
    super();

    this.threeAdd = this.add;
    this.threeRemove = this.remove;

    this.add = (...object: Object3D[]): any => {
      this.threeAdd(...object);
      object.forEach((obj: Object3D) => GameObject.app3D.add(obj));
    };

    this.remove = (...object: Object3D[]): any => {
      this.threeRemove(...object);
      object.forEach((obj: Object3D) => GameObject.app3D.remove(obj));
    };
  }

  start(): void {}

  stop(): void {}
}
