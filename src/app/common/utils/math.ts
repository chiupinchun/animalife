export const calcDistance = (
  coordinate1: [number, number],
  coordinate2: [number, number]
) => {
  const [x1, y1] = coordinate1
  const [x2, y2] = coordinate2

  return Math.pow(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2), 0.5)
}