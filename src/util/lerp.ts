const lerp = (a: number, b: number, weight: number) => (1 - weight) * a + weight * b;

export default lerp;
