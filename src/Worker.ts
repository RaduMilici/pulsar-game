// Worker.ts
import Component from "pulsar-pathfinding/dist/ecs/Component";

console.log(Component);

const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: "fosdasdao" });
function fibonacci(num: number): number {
  if (num <= 1) return 1;

  return fibonacci(num - 1) + fibonacci(num - 2);
}

console.log(fibonacci(40));
console.log(fibonacci(40));
console.log(fibonacci(40));
console.log(fibonacci(40));
console.log(fibonacci(40));
// Respond to message from parent thread
ctx.addEventListener("message", (event) => console.log(event));