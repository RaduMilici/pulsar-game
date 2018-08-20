import { Vector, BoundingBox } from 'pulsar-pathfinding';

const topLeft: Vector = new Vector({ x: -10, y: 10 });
const topRight: Vector = new Vector({ x: 10, y: 10 });
const bottomLeft: Vector = new Vector({ x: -10, y: -10 });
const bottomRight: Vector = new Vector({ x: 10, y: -10 });

const boundingBox: BoundingBox = new BoundingBox([
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
]);

export default boundingBox;
