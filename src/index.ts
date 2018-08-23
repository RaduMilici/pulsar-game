import { App3D } from './App3D';
import { app3DSettings, debugBoundingBox } from './const';
import { Level } from './entities';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray } from './util';
import { Vector } from 'pulsar-pathfinding';

const app3D: App3D = new App3D(app3DSettings);
app3D.camera.position.set(0, 25, 0);

let roomsCount: number = 20;

const generate = () => {
  console.time('level');
  app3D.clear();
  const points: Vector[] = uniqueVectorArray(debugBoundingBox, roomsCount);
  /*const points: Vector[] = [
    new Vector({ x: -15, y: -15 }),
    new Vector({ x: 0, y: 0 }),
    new Vector({ x: 15, y: 15 }),
    new Vector({ x: 3, y: 15 })
  ];*/
  const level: Level = new Level(points);
  app3D.add(level);
  app3D.start();
  console.timeEnd('level');
};

//setInterval(generate, 30);

generate();
const roomsCountInput: HTMLInputElement = <HTMLInputElement>document.getElementById('roomsCount');
roomsCountInput.value = roomsCount.toString();

document.getElementById('generate').addEventListener('click', generate);
document.getElementById('roomsCount').addEventListener('change', function() {
  const inputValue: string = roomsCountInput.value;
  const inputValueInt: number = parseInt(inputValue);
  if (inputValueInt >= 3) {
    roomsCount = inputValueInt;
  }
});

new OrbitControls(app3D.camera, app3D.renderer.domElement);
