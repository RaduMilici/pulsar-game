import { app3DSettings } from '../types';

const settings: app3DSettings = {
  containerSelector: '#container3D',
  camera: {
    fov: 70,
    near: 0.1,
    far: 100,
  },
  renderer: {
    width: 800,
    height: 700,
    antialias: false,
  },
};

export default settings;
