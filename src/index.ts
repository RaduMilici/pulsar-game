import { App3D } from './App3D';
import { app3DSettings, debugBoundingBox } from './const';
import { Level } from './entities';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray } from './util';
import { Vector, randomInt, randomFloat } from 'pulsar-pathfinding';

const app3D: App3D = new App3D(app3DSettings);
app3D.camera.position.set(10, 10, 10);

const generate = () => {
  console.time('level');
  app3D.clear();
  //const points: Vector[] = uniqueVectorArray(debugBoundingBox, 15);

  /*const points: Vector[] = [];
  for (let x = -50; x < 50; x += 1) {
    const vector: Vector = new Vector({ x, y: randomFloat(-5, 5) + x });
    points.push(vector);
  }*/

  const points: Vector[] = [
    new Vector({ x: -2, y: 1 }),
    new Vector({ x: -12, y: -6 }),
    new Vector({ x: 14, y: -15 }),
  ];

  const level: Level = new Level(points);
  app3D.add(level);
  app3D.start();
  console.timeEnd('level');
};

// setInterval(generate, 150);

generate();

document.getElementById('generate').addEventListener('click', generate);

new OrbitControls(app3D.camera, app3D.renderer.domElement);
