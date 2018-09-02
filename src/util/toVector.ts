import { Vector } from 'pulsar-pathfinding';
import { Vector3 } from 'three';

const toVector = ({ x, z }: Vector3): Vector => new Vector({ x, y: z });

export default toVector;
