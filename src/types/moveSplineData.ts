import { Vector2 } from 'three';
import GameObject from '../entities/GameObject';

type moveSplineData = {
  path: Vector2[];
  speed: number;
  mobile: GameObject;
};

export default moveSplineData;
