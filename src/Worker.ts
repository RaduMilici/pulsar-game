// Worker.ts
import { Component } from "pulsar-pathfinding";

console.log(Component);

const ctx: Worker = self as any;

// Post data to parent thread
ctx.postMessage({ foo: "fosdasdao" });

// Respond to message from parent thread
ctx.addEventListener("message", (event) => console.log(event));