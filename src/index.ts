// import { OrbitControls } from 'three-orbitcontrols-ts';
import { DEBUG_BOUNDING_BOX, ORB_CONTAINER } from './const';
import { color } from 'types';
import { uniqueVectorArray, EventManager } from './util';
import { Vector } from 'pulsar-pathfinding';
import Level from 'entities/level/Level';
import PerlinNoise from 'components/perlin_noise/PerlinNoise';

const addTestNoise = () => {
  const noise: PerlinNoise = new PerlinNoise({ width: 64, height: 64 });
  ORB_CONTAINER.appendChild(noise.canvas);
};

const eventManager: EventManager = new EventManager();

const clearContainers = () => {
  while (ORB_CONTAINER.firstChild) {
    ORB_CONTAINER.removeChild(ORB_CONTAINER.firstChild);
  }
};

const generate = () => {
  console.time('level');
  clearContainers();
  addTestNoise();
  eventManager.remove('#container3D');
  app3D.clear();

  const points: Vector[] = uniqueVectorArray(DEBUG_BOUNDING_BOX, 45);
  const level: Level = new Level(points, DEBUG_BOUNDING_BOX, app3D);
  eventManager.add(
    '#container3D',
    'mousedown',
    level.player.controller.onClick.bind(level.player.controller)
  );

  eventManager.add('#container3D', 'contextmenu', (event: Event) => event.preventDefault());

  app3D.add(level, app3D.scene);
  app3D.start();
  console.timeEnd('level');
};

window.addEventListener('load', generate);
document.getElementById('generate').addEventListener('click', generate);

//new OrbitControls(app3D.camera, app3D.renderer.domElement);
