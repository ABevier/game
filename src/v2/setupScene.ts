import { GameMap, GameState, Player, Unit, UnitSpec } from "./gameState";

export class SetupScene extends Phaser.Scene {
  public preload() {
    console.log("preload setup scene");
    this.load.image("hex", "assets/hex.png");
    this.load.image("hex_highlight", "assets/hex_highlight.png");

    this.load.image("knight", "assets/Knight.png");
    this.load.image("warrior", "assets/Warrior.png");
  }

  create() {
    //
    // Game setup stuff
    //
    const gameState = new GameState();

    //map
    const map = new GameMap(12, 8);
    gameState.map = map;

    //player 1
    const player1 = new Player("player-1");
    const unit1 = new Unit("unit-1", player1.id, new UnitSpec("knight"));
    unit1.position = { x: 1, y: -2, z: 1 };

    const unit2 = new Unit("unit-2", player1.id, new UnitSpec("knight"));
    unit2.position = { x: 2, y: -2, z: 0 };

    const unit3 = new Unit("unit-3", player1.id, new UnitSpec("knight"));
    unit3.position = { x: 3, y: -2, z: -1 };

    //player 2
    const player2 = new Player("player-2");

    const unit4 = new Unit("unit-4", player2.id, new UnitSpec("warrior"));
    unit4.position = { x: 3, y: -4, z: 1 };

    const unit5 = new Unit("unit-5", player2.id, new UnitSpec("warrior"));
    unit5.position = { x: 3, y: -5, z: 2 };

    const unit6 = new Unit("unit-6", player2.id, new UnitSpec("warrior"));
    unit6.position = { x: 4, y: -5, z: 1 };

    gameState.players = [player1, player2];
    gameState.units = [unit1, unit2, unit3, unit4, unit5, unit6];
    gameState.activePlayerId = player1.id;

    this.scene.start("main", gameState);
  }
}
