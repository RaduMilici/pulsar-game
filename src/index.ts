import { App3D } from './App3D';
import { app3DSettings, debugBoundingBox } from './const';
import { Level } from './entities';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { uniqueVectorArray } from './util';
import { Vector } from 'pulsar-pathfinding';

const app3D: App3D = new App3D(app3DSettings);
const points: Vector[] = uniqueVectorArray(debugBoundingBox, 20);
const level: Level = new Level(points);

app3D.add(level);
app3D.camera.position.z = 20;
app3D.camera.position.y = 20;

app3D.start();

new OrbitControls(app3D.camera, app3D.renderer.domElement);
