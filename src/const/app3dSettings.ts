import { app3DSettings } from '../types';

const settings: app3DSettings = {
  containerSelector: '#container3D',
  camera: {
    fov: 70,
    near: 0.1,
    far: 100,
  },
  renderer: {
    width: 500,
    height: 500,
    antialias: false,
  },
};

export default settings;
