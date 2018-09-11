import { Vector2 } from 'three';
import GameObject from 'entities/GameObject';

type moveSplineData = {
  path: Vector2[];
  speed: number;
  mobile: GameObject;
  onComplete?: (position: Vector2) => void;
};

export default moveSplineData;
