import { CubeCoord } from "./hexUtil";

export class Player {}

export class UnitSpec {
  constructor(public readonly spriteName: string) {}
}

export class Unit {
  public position: CubeCoord;

  constructor(public readonly id: string, public readonly spec: UnitSpec) {}
}

export class GameState {
  public units: Unit[] = [];
}
