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

/*
const range = (start: number, end: number): number[] => {
  return Array(end - start + 1)
    .fill(null)
    .map((_, idx) => start + idx);
};

const shuffle = (array: number[]): number[] => {
  return [...array].sort(() => 0.5 - Math.random());
};

const uniqueVectorArray = (box: BoundingBox, count: number): Vector[] => {
  const { topLeft, topRight, bottomLeft, bottomRight } = box;
  const points: Vector[] = [topLeft, topRight, bottomLeft, bottomRight];

  const sortedX: Vector[] = immutableObjectSort(points, 'x');
  const sortedY: Vector[] = immutableObjectSort(points, 'y');

  const firstX: Vector = sortedX[0];
  const lastX: Vector = sortedX[sortedX.length - 1];
  const firstY: Vector = sortedY[0];
  const lastY: Vector = sortedY[sortedY.length - 1];

  const baseX: number[] = range(firstX.x, lastX.x);
  const baseY: number[] = range(firstY.y, lastY.y);

  const shuffledX: number[] = shuffle(baseX);
  const shuffledY: number[] = shuffle(baseY);

  const unique: Vector[] = [];

  for (let i = 0; i < count; i++) {
    const x: number = shuffledX[i];
    const y: number = shuffledY[i];
    unique.push(new Vector({ x, y }));
  }

  return unique;
};
*/

export default uniqueVectorArray;
