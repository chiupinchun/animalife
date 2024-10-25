export enum BlockAreaType {
  enemy,
  neutral,
  ally
}

export class Block {
  constructor(
    public x: number,
    public y: number,
    public areaType: BlockAreaType
  ) { }
}

export const getInitialBoard = (width: number, height: number, domainLength: number) => {
  const board: Block[] = []

  let i = 0
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const areaType = i < width * domainLength
        ? BlockAreaType.enemy
        : i < width * (height - domainLength)
          ? BlockAreaType.neutral
          : BlockAreaType.ally
      board.push(new Block(x, y, areaType))
      i++
    }
  }

  return board
}
