const nearestPowerOf2 = (number: number): number =>
  1 << (31 - Math.clz32(number));

export default nearestPowerOf2;
