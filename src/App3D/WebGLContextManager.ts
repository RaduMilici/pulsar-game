export default class WebGLContextManager {
  private contexts: WebGLRenderingContext[] = [];

  add(context: WebGLRenderingContext): void {
    this.contexts.push(context);
  }

  clearAll(): void {
    this.contexts.forEach(WebGLContextManager.clear);
    this.contexts.length = 0;
  }

  static clear(context: WebGLRenderingContext): void {
    const extension: WEBGL_lose_context = context.getExtension('WEBGL_lose_context');
    extension.loseContext();
  }
}
