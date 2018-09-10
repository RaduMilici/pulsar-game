import App3D from './App3D/App3D';
import { app3DSettings, debugBoundingBox } from './const';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray, EventManager } from './util';
import { Vector } from 'pulsar-pathfinding';
import Level from 'entities/level/Level';
import GameObject from 'entities/GameObject';

const app3D: App3D = new App3D(app3DSettings);
const eventManager: EventManager = new EventManager();
app3D.camera.position.set(50, 75, 50);
GameObject.app3D = app3D;
GameObject.scene = app3D.scene;

const generate = () => {
  console.time('level');
  eventManager.remove('#container3D');
  app3D.clear();

  const points: Vector[] = uniqueVectorArray(debugBoundingBox, 25);
  const level: Level = new Level(points, debugBoundingBox, app3D);

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
