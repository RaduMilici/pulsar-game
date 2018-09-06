import { Vector2 } from 'three';
import { GameObject } from 'entities';

type moveSplineData = {
  path: Vector2[];
  speed: number;
  mobile: GameObject;
  onFinish?: (position: Vector2) => void;
};

export default moveSplineData;
