import { Vector, BoundingBox } from 'pulsar-pathfinding';

const topLeft: Vector = new Vector({ x: -15, y: 15 });
const topRight: Vector = new Vector({ x: 15, y: 15 });
const bottomLeft: Vector = new Vector({ x: -15, y: -15 });
const bottomRight: Vector = new Vector({ x: 15, y: -15 });

const boundingBox: BoundingBox = new BoundingBox([
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
]);

export default boundingBox;
