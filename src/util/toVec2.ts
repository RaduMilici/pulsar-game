import { Vector } from 'pulsar-pathfinding';
import { Vector2 } from 'three';

const toVec2 = ({ x, y }: Vector): Vector2 => new Vector2(x, y);

export default toVec2;
