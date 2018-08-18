import { Object3D } from 'three';
import { Entity, Updater, Component } from 'pulsar-pathfinding';

export default class GameObject extends Object3D implements Entity {
  updater: Updater = null;
  readonly components: Component[] = [];
}
