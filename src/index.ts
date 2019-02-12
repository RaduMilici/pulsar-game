import { DEBUG_BOUNDING_BOX } from './const';
import { color } from 'types';
// import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray, EventManager } from './util';
import { Vector } from 'pulsar-pathfinding';
import Level from 'entities/level/Level';
import Orb from './ui/orb/Orb';

const red: color = { r: 1, g: 0, b: 0, a: 1 };
const blue: color = { r: 0, g: 0, b: 1, a: 1 };
const orb1: Orb = new Orb({ width: 512, height: 512 }, red);
const orb2: Orb = new Orb({ width: 512, height: 512 }, blue);

const eventManager: EventManager = new EventManager();

const generate = () => {
  console.time('level');
  eventManager.remove('#container3D');
  app3D.clear();

  const points: Vector[] = uniqueVectorArray(DEBUG_BOUNDING_BOX, 25);
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

generate();

//setInterval(generate, 300);

document.getElementById('generate').addEventListener('click', generate);

//new OrbitControls(app3D.camera, app3D.renderer.domElement);
