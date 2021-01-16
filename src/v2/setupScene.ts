import { GameState, Player, Unit, UnitSpec } from "./gameState";

export class SetupScene extends Phaser.Scene {
  public preload() {
    console.log("preload setup scene");
    this.load.image("hex", "assets/hex.png");

    this.load.image("knight", "assets/Knight.png");
    this.load.image("warrior", "assets/Warrior.png");
  }

  create() {
    //
    // Game setup stuff
    //
    const gameState = new GameState();

    //player 1
    const player1 = new Player("player-1");
    const unit1 = new Unit("unit-1", player1.id, new UnitSpec("knight"));
    unit1.position = { x: 1, y: -2, z: 1 };

    //player 2
    const player2 = new Player("player-2");
    const unit2 = new Unit("unit-2", player2.id, new UnitSpec("warrior"));
    unit2.position = { x: 3, y: -4, z: 1 };

    gameState.players = [player1, player2];
    gameState.units = [unit1, unit2];
    gameState.activePlayerId = player1.id;

    this.scene.start("main", gameState);
  }
}
