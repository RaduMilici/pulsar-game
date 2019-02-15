import App3D from 'src/App3D/App3D';
import { APP_3D_SETTINGS } from 'const';

const app3D: App3D = new App3D(APP_3D_SETTINGS);

const add = app3D.add.bind(app3D);
const remove = app3D.remove.bind(app3D);
const clear = app3D.clear.bind(app3D);
const start = app3D.start.bind(app3D);
const webGLContextManager = app3D.webGLContextManager;
const { updater, renderer, settings, camera, scene }: App3D = app3D;

export {
  add,
  remove,
  camera,
  clear,
  updater,
  renderer,
  settings,
  start,
  scene,
  webGLContextManager,
};
