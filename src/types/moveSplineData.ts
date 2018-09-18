import { Vector2 } from 'three';
import Mobile from 'entities/Mobile';
import moveSplineStep from './moveSplineStep'

type moveSplineData = {
  path: moveSplineStep[];
  mobile: Mobile;
  onComplete?: (position: Vector2) => void;
};

export default moveSplineData;
