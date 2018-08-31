import { Vector } from 'pulsar-pathfinding';
import { Vector3 } from 'three';

const toVec2 = ({ x, z }: Vector3): Vector => new Vector({ x, y: z });

export default toVec2;
