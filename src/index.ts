import { App3D } from './App3D';
import { app3DSettings } from './const';
import { Cube } from './entities';

const app3D: App3D = new App3D(app3DSettings);
const cube: Cube = new Cube();

app3D.add(cube);
app3D.camera.position.z = 5;

app3D.start();
