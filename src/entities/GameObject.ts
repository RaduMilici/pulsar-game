import { Object3D } from 'three';
import { Entity, Updater, Component } from 'pulsar-pathfinding';
import App3D from '../App3D/App3D';

export default class GameObject extends Object3D implements Entity {
  updater: Updater = null;
  readonly components: Component[] = [];

  start(): void {}

  stop(): void {}
}
