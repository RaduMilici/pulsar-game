const findElement = (selector: string): HTMLElement | null => {
  const container: HTMLElement | null = document.querySelector(selector);

  if (container === null) {
    console.error(`Can't find container with selector ${selector}`);
  }

  return container;
};

export default findElement;
