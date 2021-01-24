import { isEqual } from "lodash";
import { CubeCoord } from "./coords";
import HexUtil from "./hexUtil";

export class GameMap {
  constructor(public readonly width: number, public readonly height: number) {}
}

export class Player {
  constructor(public readonly id: string) {}
}

export class UnitSpec {
  constructor(public readonly spriteName: string) {}
}

export class Unit {
  public position: CubeCoord;

  public cooldown = 0;

  constructor(
    public readonly id: string,
    public readonly playerId: string,
    public readonly spec: UnitSpec
  ) {}
}

export class GameState {
  public activePlayerId: string;
  //TODO: should this be a map?
  public players: Player[] = [];

  public activeUnitId: string;
  public units: Unit[] = [];
  public map: GameMap;
}

export class GameEngine {
  constructor(
    public gameState: GameState,
    private readonly onStateUpdated: (g: GameState) => void
  ) {}

  public canActivateUnit(unit: Unit): boolean {
    return (
      unit.playerId === this.gameState.activePlayerId && unit.cooldown === 0
    );
  }

  public findUnitAtCoordinate(coord: CubeCoord): Unit | null {
    //consider not using lodash for this and just making CubeCoord a class?
    return this.gameState.units.find((unit) => isEqual(unit.position, coord));
  }

  public findMovesForUnit(unit: Unit): CubeCoord[] {
    //todo: real movement with a flood fill
    return this.findNeighborsForCoord(unit.position).filter(
      (coord) => !this.findUnitAtCoordinate(coord)
    );
  }

  public findNeighborsForCoord(coord: CubeCoord): CubeCoord[] {
    const hexes = HexUtil.getNeighbors(coord);
    return hexes.filter((coord) => this.isCoordinateInBounds(coord));
  }

  public isCoordinateInBounds(coord: CubeCoord): boolean {
    // easiest way to figure this out is using offset coordinates
    const offsetCoord = HexUtil.cubeCoordToOffsetCoord(coord);

    return (
      offsetCoord.x >= 0 &&
      offsetCoord.x < this.gameState.map.width &&
      offsetCoord.y >= 0 &&
      offsetCoord.y <= this.gameState.map.height
    );
  }

  //TODO: this is just a junky stub
  public takeAction(unit: Unit, coord: CubeCoord) {
    console.log("take action:", unit);
    unit.position = coord;
    unit.cooldown = 1;
    this.updateState();
  }

  private updateState() {
    const otherPlayer = this.gameState.players.find(
      (player) => player.id !== this.gameState.activePlayerId
    );

    const nextPlayerId = this.findNextActivePlayer([
      otherPlayer.id,
      this.gameState.activePlayerId,
    ]);

    this.gameState.activePlayerId = nextPlayerId;
    console.log("finished updating state, invoking callback");
    this.onStateUpdated(this.gameState);
  }

  private findNextActivePlayer(playersIds: string[]): string {
    // First try to find a unit the next player can activate.
    // If the other player has nothing that can activate then the current player can activate
    // If nobody can activate anything, then end the round which reduces cooldown
    while (true) {
      const nextPlayerId = playersIds.find((playerId) =>
        this.canActivatePlayer(playerId)
      );

      if (nextPlayerId) {
        return nextPlayerId;
      }

      this.endRound();
    }
  }

  private canActivatePlayer(playerId: string): boolean {
    const units = this.findUnitsWithNoCooldownForPlayer(playerId);
    return units.length > 0;
  }

  private findUnitsWithNoCooldownForPlayer(playerId: string): Unit[] {
    return this.gameState.units.filter(
      (unit) => unit.playerId === playerId && unit.cooldown === 0
    );
  }

  private endRound() {
    console.log("end round");
    this.gameState.units.forEach((unit) => {
      unit.cooldown = unit.cooldown - 1;
    });
  }
}
