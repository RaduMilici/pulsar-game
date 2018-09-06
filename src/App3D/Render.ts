import { Component } from 'pulsar-pathfinding';
import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';
import App3D from './App3D';

export default class Render extends Component {
  private readonly renderer: WebGLRenderer;
  private readonly camera: PerspectiveCamera;
  private readonly scene: Scene;

  constructor({ renderer, camera, scene }: App3D) {
    super();
    this.renderer = renderer;
    this.camera = camera;
    this.scene = scene;
  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }
}
