import { App3D } from './App3D';
import { app3DSettings, debugBoundingBox } from './const';
import { Level } from './entities';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray } from './util';
import { Vector, randomInt, randomFloat, DegToRad } from 'pulsar-pathfinding';

const app3D: App3D = new App3D(app3DSettings);
app3D.camera.position.set(50, 75, 50);

const generate = () => {
  console.time('level');
  app3D.clear();
  const points: Vector[] = uniqueVectorArray(debugBoundingBox, 50);

  /*const points: Vector[] = [];
  for (let x = 6; x < 94; x++) {
    const vector: Vector = new Vector({ x, y: randomFloat(-5, 5) + x });
    points.push(vector);
  }*/

  /*const points: Vector[] = [];
  for (let x = 1; x < 99; x += 10) {
      const v1: Vector = new Vector({ x, y: 20 });
      const v4: Vector = new Vector({ x, y: 80 });
      points.push(v1, v4);
  }*/

  /*const points: Vector[] = [
    new Vector({ x: -2, y: 1 }),
    new Vector({ x: -12, y: -6 }),
    new Vector({ x: 14, y: -15 }),
  ];*/

  const level: Level = new Level(points, debugBoundingBox, app3D);
  /*level.position.set(
    -debugBoundingBox.width / 2,
    0,
    -debugBoundingBox.height / 2
  );*/
  app3D.add(level);
  app3D.start();
  console.timeEnd('level');
};

// setInterval(generate, 150);

generate();

document.getElementById('generate').addEventListener('click', generate);

//new OrbitControls(app3D.camera, app3D.renderer.domElement);
