import { Vector2 } from "three";
import { NavigatorTile } from 'pulsar-pathfinding';

type moveSplineStep = {
  position: Vector2;
  tile?: NavigatorTile;
};

export default moveSplineStep;
