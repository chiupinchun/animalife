import { Unit } from "@game/unit/unit";
import { BOARD_X_COUNT, BOARD_Y_COUNT, DOMAIN_LENGTH } from "../constants/game";

export const getAutoSummonCoordinate = (
  summonedUnits: Unit[],
  isEnemy?: boolean
) => {
  for (let yIndex = 0; yIndex < DOMAIN_LENGTH; yIndex++) {
    for (let xIndex = 0; xIndex < BOARD_X_COUNT; xIndex++) {
      const direct = xIndex % 2 ? -1 : 1
      const length = Math.floor(xIndex / 2)
      const height = yIndex + (xIndex % BOARD_X_COUNT ? 0 : 1)
      const coordinate = {
        x: Math.floor(BOARD_X_COUNT / 2) + length * direct,
        y: isEnemy ? (BOARD_Y_COUNT - height - 1) : height
      }
      const isCoordinateSummoned = summonedUnits.some(
        unit => unit.x === coordinate.x && unit.y === coordinate.y
      )
      if (!isCoordinateSummoned) {
        return coordinate
      }
    }
  }
  return null
}