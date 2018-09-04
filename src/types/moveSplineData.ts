import { Vector2 } from 'three';
import GameObject from '../entities/GameObject';
import { Updater } from 'pulsar-pathfinding';

type moveSplineData = {
  path: Vector2[];
  speed: number;
  mobile: GameObject;
  updater: Updater;
};

export default moveSplineData;
