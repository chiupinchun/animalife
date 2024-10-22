class Block {
  constructor(
    public x: number,
    public y: number
  ) { }
}

export const getInitialBoard = (width: number, height: number) => {
  const board: Block[] = []

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      board.push(new Block(x, y))
    }
  }

  return board
}
