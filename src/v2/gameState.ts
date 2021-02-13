import { isEqual } from "lodash";
import { CubeCoord } from "./coords";
import { coordToString } from "./coordUtil";
import HexUtil from "./hexUtil";
import Pathfinder from "./pathfinder";

//TODO: all of these classes need to be interfaces!!

export class GameMap {
  constructor(public readonly width: number, public readonly height: number) {}
}

export class Player {
  constructor(public readonly id: string) {}
}

export class UnitSpec {
  constructor(
    public readonly spriteName: string,
    public readonly movement: number
  ) {}
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

export interface CurrentTurnState {
  activeUnitId: string | null;
  unitHasMoved: boolean;
  unitHasAttacked: boolean;
}

export class GameState {
  public activePlayerId: string;
  //TODO: should this be a map?
  public players: Player[] = [];

  public currentTurnState: CurrentTurnState = {
    activeUnitId: null,
    unitHasAttacked: false,
    unitHasMoved: false,
  };

  public units: Unit[] = [];
  public map: GameMap;
}

export class Action {
  constructor(
    public readonly unitId: string,
    public readonly actionId: string,
    public readonly coord: CubeCoord
  ) {}

  toString() {
    return (
      `UnitId: ${this.unitId} Action: ${this.actionId} ` +
      `Coord: ${coordToString(this.coord)}`
    );
  }
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

  public findUnitById(unitId: String): Unit | null {
    return this.gameState.units.find((unit) => unit.id === unitId);
  }

  public findActiveUnit(): Unit | null {
    if (this.gameState.currentTurnState.activeUnitId) {
      return this.findUnitById(this.gameState.currentTurnState.activeUnitId);
    }
    return null;
  }

  public findUnitAtCoordinate(coord: CubeCoord): Unit | null {
    //consider not using lodash for this and just making CubeCoord a class?
    return this.gameState.units.find((unit) => isEqual(unit.position, coord));
  }

  public findOptionsForUnit(unit: Unit): string[] {
    const {
      unitHasMoved,
      unitHasAttacked,
      activeUnitId,
    } = this.gameState.currentTurnState;

    const result: string[] = [];
    if (!unitHasMoved) {
      result.push("move");
    }
    if (!unitHasAttacked) {
      result.push("attack");
    }
    if (activeUnitId) {
      result.push("end turn");
    }
    return result;
  }

  public findMovesForUnit(unit: Unit): CubeCoord[] {
    return Pathfinder.findMovesForUnit(this, unit);
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

  public takeAction(action: Action) {
    console.log("take action:", action);
    const unit = this.findUnitById(action.unitId);

    if (action.actionId === "move") {
      console.log("do move");
      unit.position = action.coord;
      this.gameState.currentTurnState.activeUnitId = unit.id;
      this.gameState.currentTurnState.unitHasMoved = true;
    } else if (action.actionId === "attack") {
      console.log("do attack");
      const target = this.findUnitAtCoordinate(action.coord);
      if (target) {
        console.log("would attack", target);
      }
      unit.cooldown += 2;

      this.gameState.currentTurnState.activeUnitId = unit.id;
      this.gameState.currentTurnState.unitHasAttacked = true;
    } else if (action.actionId === "end turn") {
      if (unit.cooldown === 0) {
        unit.cooldown = 1;
      }
      this.onEndTurn();
    }

    console.log("finished updating state, invoking callback");
    this.onStateUpdated(this.gameState);
  }

  private onEndTurn() {
    const otherPlayer = this.gameState.players.find(
      (player) => player.id !== this.gameState.activePlayerId
    );

    const nextPlayerId = this.findNextActivePlayer([
      otherPlayer.id,
      this.gameState.activePlayerId,
    ]);

    this.gameState.activePlayerId = nextPlayerId;
    this.gameState.currentTurnState = {
      activeUnitId: null,
      unitHasMoved: false,
      unitHasAttacked: false,
    };
    console.log("finished updating to new turn");
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
