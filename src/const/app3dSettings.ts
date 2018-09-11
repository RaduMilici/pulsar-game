import { app3DSettings } from '../interfaces';

const settings: app3DSettings = {
  containerSelector: '#container3D',
  camera: {
    fov: 70,
    near: 0.1,
    far: 150,
  },
  renderer: {
    width: window.innerWidth - 25,
    height: window.innerHeight - 50,
    antialias: false,
  },
};

export default settings;
