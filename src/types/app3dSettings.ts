type app3DSettings = {
  containerSelector: string;
  camera: {
    fov: number;
    near: number;
    far: number;
  };
  renderer: {
    width: number;
    height: number;
    antialias: boolean;
  };
};

export default app3DSettings;
