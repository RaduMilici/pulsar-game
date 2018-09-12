import {Navigator, NavigatorTile, navigatorSettings, Grid} from 'pulsar-pathfinding';

const ctx: Worker = self as any;

const start = ({ data }: MessageEvent) => {
  /*const begin: NavigatorTile = new NavigatorTile(data.begin.position);
  const end: NavigatorTile = new NavigatorTile(data.end.position);
  const grid: Grid = new Grid({ width: data.grid.width, height: data.grid.height});
  grid.copy(data.grid);*/
  console.log(data);
  const navigator: Navigator = new Navigator(data);
  navigator.start();
};

const onComplete = (path: NavigatorTile[]) => {
  console.log(path);
};


ctx.addEventListener("message", start);