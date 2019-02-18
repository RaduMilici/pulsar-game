import { Vector, randomFloat, point } from 'pulsar-pathfinding';

const randomVector2 = (): Vector => {
  const x: number = randomFloat(0, 1);
  const y: number = randomFloat(0, 1);
  const point: point = { x, y };
  return new Vector(point);
};

export { randomVector2 };
