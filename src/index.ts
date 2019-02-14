// import { OrbitControls } from 'three-orbitcontrols-ts';
import { DEBUG_BOUNDING_BOX, ORB_CONTAINER } from './const';
import { color } from 'types';
import { uniqueVectorArray, EventManager } from './util';
import { Vector } from 'pulsar-pathfinding';
import Level from 'entities/level/Level';

const eventManager: EventManager = new EventManager();

const clearContainers = () => {
  while (ORB_CONTAINER.firstChild) {
    ORB_CONTAINER.removeChild(ORB_CONTAINER.firstChild);
  }
};

/*const addOrbs = (level: Level) => {
  const orb1: Orb = new Orb({ width: 512, height: 512 }, red);
  const orb2: Orb = new Orb({ width: 512, height: 512 }, blue);
  orbContainer.appendChild(orb1.canvas);
  orbContainer.appendChild(orb2.canvas);
};*/

const generate = () => {
  console.time('level');
  clearContainers();
  eventManager.remove('#container3D');
  app3D.clear();

  const points: Vector[] = uniqueVectorArray(DEBUG_BOUNDING_BOX, 25);
  const level: Level = new Level(points, DEBUG_BOUNDING_BOX, app3D);
  eventManager.add(
    '#container3D',
    'mousedown',
    level.player.controller.onClick.bind(level.player.controller)
  );

  //addOrbs(level);

  eventManager.add('#container3D', 'contextmenu', (event: Event) => event.preventDefault());

  app3D.add(level, app3D.scene);
  app3D.start();
  console.timeEnd('level');
};

generate();

//setInterval(generate, 300);

document.getElementById('generate').addEventListener('click', generate);

//new OrbitControls(app3D.camera, app3D.renderer.domElement);
