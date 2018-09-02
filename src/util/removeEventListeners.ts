const removeAllEventListenersFromElement = (element: HTMLElement) => {
  let clone = element.cloneNode();
  // move all child elements from the original to the clone
  while (element.firstChild) {
    clone.appendChild(element.lastChild);
  }

  element.parentNode.replaceChild(clone, element);
};

export default removeAllEventListenersFromElement;
