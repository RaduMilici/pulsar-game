import { App3D } from './App3D';
import { app3DSettings, debugBoundingBox } from './const';
import { Level } from './entities';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray } from './util';
import { Vector } from 'pulsar-pathfinding';

const app3D: App3D = new App3D(app3DSettings);
app3D.camera.position.set(0, 25, 0);

const generate = () => {
  console.time('level');
  app3D.clear();
  const points: Vector[] = uniqueVectorArray(debugBoundingBox, 20);
  const level: Level = new Level(points);
  app3D.add(level);
  app3D.start();
  console.timeEnd('level');
};

//setInterval(generate, 30);

generate();

document.getElementById('generate').addEventListener('click', generate);

new OrbitControls(app3D.camera, app3D.renderer.domElement);
