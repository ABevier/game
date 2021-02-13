import CoordMap from "./coordMap";
import { CubeCoord } from "./coords";
import { GameEngine, Unit } from "./gameState";

interface PathValue {
  moveCost: number;
  coord: CubeCoord;
}

class Pathfinder {
  public findMovesForUnit(game: GameEngine, unit: Unit): CubeCoord[] {
    const openList: PathValue[] = [];
    const closedList = new CoordMap<CubeCoord>();

    // Seed the open list with initial moves
    openList.push(...this.findValidNextMoves(game, unit.position, 1));

    while (openList.length > 0) {
      const current = openList.pop();
      closedList.set(current.coord, current.coord);

      if (current.moveCost <= unit.spec.movement) {
        openList.push(
          ...this.findValidNextMoves(game, current.coord, current.moveCost)
        );
      }
    }

    return closedList.valuesToList();
  }
  private findValidNextMoves(
    game: GameEngine,
    currentCoord: CubeCoord,
    currentMoveCost: number
  ): PathValue[] {
    return game
      .findNeighborsForCoord(currentCoord)
      .filter((coord) => !game.findUnitAtCoordinate(coord))
      .map((coord) => ({ coord, moveCost: currentMoveCost + 1 }));
  }
}

//TODO: look into the proper way to export this
export default new Pathfinder();
