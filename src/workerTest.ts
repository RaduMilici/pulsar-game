// App.ts
import Worker from "worker-loader?publicPath=dist/!./Worker";

const worker = new Worker();

worker.postMessage({ a: 1 });
worker.onmessage = (event) => {console.log(event);};

worker.addEventListener("message", (event) => {console.log(event);});