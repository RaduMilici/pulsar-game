import { Vector, BoundingBox, immutableObjectSort, randomInt } from 'pulsar-pathfinding';

const uniqueVectorArray = (box: BoundingBox, count: number): Vector[] => {
  const { topLeft, topRight, bottomLeft, bottomRight } = box;
  const points: Vector[] = [topLeft, topRight, bottomLeft, bottomRight];
  const delta: number = 1;

  const sortedX: Vector[] = immutableObjectSort(points, 'x');
  const sortedY: Vector[] = immutableObjectSort(points, 'y');

  const firstX: Vector = sortedX[0];
  const lastX: Vector = sortedX[sortedX.length - 1];
  const firstY: Vector = sortedY[0];
  const lastY: Vector = sortedY[sortedY.length - 1];

  const random: Vector[] = [];

  for (let i = 0; i < count; i++) {
    const x: number = randomInt(firstX.x + delta, lastX.x - delta);
    const y: number = randomInt(firstY.y + delta, lastY.y - delta);
    random.push(new Vector({ x, y }));
  }

  return Vector.UniqueFromArray(random);
};

export default uniqueVectorArray;
