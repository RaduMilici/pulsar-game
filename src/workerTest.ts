// App.ts
import Worker1 from "worker-loader?publicPath=dist/&name=Worker.js!./Worker";

const worker = new Worker1();

worker.postMessage({ a: 1 });
worker.onmessage = (event: any) => {
  console.log('worker.onmessage');
  console.log(event);
};

worker.addEventListener("message", (event: any) => {
  console.log('addEventListener');
  console.log(event);
});
