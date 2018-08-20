import { Vector } from 'pulsar-pathfinding';
import { Vector3 } from 'three';

const toVec3 = ({ x, y }: Vector): Vector3 => new Vector3(x, 0, y);

export default toVec3;
