import { Vector2, Vector3 } from 'three';
import GameObject from '../entities/GameObject';
import { Updater } from 'pulsar-pathfinding';

type moveSplineData = {
  path: Vector2[];
  speed: number;
  mobile: GameObject;
  updater: Updater;
  onFinish?: (position: Vector2) => void;
};

export default moveSplineData;
