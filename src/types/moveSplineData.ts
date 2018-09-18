import { Vector2 } from 'three';
import Mobile from 'entities/Mobile';

type moveSplineData = {
  path: Vector2[];
  mobile: Mobile;
  onComplete?: (position: Vector2) => void;
};

export default moveSplineData;
