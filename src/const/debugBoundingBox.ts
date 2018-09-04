import { Vector, BoundingBox } from 'pulsar-pathfinding';

const topLeft: Vector = new Vector({ x: 0, y: 100 });
const topRight: Vector = new Vector({ x: 100, y: 100 });
const bottomLeft: Vector = new Vector({ x: 0, y: 0 });
const bottomRight: Vector = new Vector({ x: 100, y: 0 });

const boundingBox: BoundingBox = new BoundingBox([topLeft, topRight, bottomLeft, bottomRight]);

export default boundingBox;
