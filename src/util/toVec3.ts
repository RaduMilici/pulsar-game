import { Vector } from 'pulsar-pathfinding';
import { Vector3 } from 'three';

const toVec3 = ({ x, y }: Vector, customY: number = 0): Vector3 =>
  new Vector3(x, customY, y);

export default toVec3;
