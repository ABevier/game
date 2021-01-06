import { Game } from "phaser";
import { GameEngine, GameState, Player, Unit, UnitSpec } from "./gameState";
import HexMap, { OffsetCoord, Pixel } from "./hexMap";
import hexUtil from "./hexUtil";
import { isEqual, keyBy } from "lodash";
import { game } from "../main";

// hex tiles: https://opengameart.org/content/hex-tileset-pack
// used Piskel (piskelappcom)

export class MainScene extends Phaser.Scene {
  private pixelText: Phaser.GameObjects.Text;
  private posText: Phaser.GameObjects.Text;

  private hexMap: HexMap;

  private gameEngine: GameEngine;

  private activePlayerText: Phaser.GameObjects.Text;
  private renderedUnits = new Map<string, Phaser.GameObjects.Sprite>();

  public preload() {
    console.log("preload main scene");
    this.load.image("hex", "assets/hex.png");

    this.load.image("knight", "assets/Knight.png");
    this.load.image("warrior", "assets/Warrior.png");
  }

  public create() {
    console.log("create main scene");

    this.pixelText = this.add.text(700, 10, "pixel");
    this.posText = this.add.text(700, 25, "offset coord");
    this.activePlayerText = this.add.text(700, 100, "active player:");

    //tile x dimensions are: 7px space, 18px edge, 7px space
    //scaled up it is: 14px, 36px, 14px
    //the offset is 7px * 18px = 25 then *2 for scale so 50px
    //the edge is 18px then *2 for scale so 32px
    let xOffset = 25;
    let yOffset = 25;
    let tileWidth = 64;
    let tileHeight = 64;
    let xEdge = 36;

    this.hexMap = new HexMap(xOffset, yOffset, tileWidth, tileHeight, xEdge);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 12; x++) {
        const pixel = this.hexMap.offsetCoordinateToPixel({ x, y });
        this.add.sprite(pixel.x, pixel.y, "hex").setScale(2).setOrigin(0, 0);

        this.addDebugText(pixel, { x, y });
      }
    }

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

    this.gameEngine = new GameEngine(gameState, (gameState) =>
      this.renderGameState(gameState)
    );

    this.renderGameState(this.gameEngine.gameState);

    //
    // Input Handling
    //
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      //TODO: refactor to new function
      const pixel = { x: pointer.worldX, y: pointer.worldY };

      const offsetCoord = this.hexMap.pixelToOffsetCoordinate(pixel);
      const cubeCoord = hexUtil.offsetCoordToCubeCoord(offsetCoord);

      console.log(
        `pointer up: pixel:${pixel.x}, ${pixel.y} offset:${offsetCoord.x}, ${offsetCoord.y} cube:${cubeCoord.x}, ${cubeCoord.y}, ${cubeCoord.z}}`
      );

      const found = this.gameEngine.findUnitAtCoordinate(cubeCoord);
      if (found) {
        console.log(`clicked on unit with id:${found.id}`);
        if (this.gameEngine.canActivateUnit(found)) {
          this.gameEngine.takeAction(found);
        }
      }
    });
  }

  public update() {
    const pixel = {
      x: this.game.input.mousePointer.worldX,
      y: this.game.input.mousePointer.worldY,
    };

    this.pixelText.text = `pixel    x: ${pixel.x} y: ${pixel.y}`;

    const coord = this.hexMap.pixelToOffsetCoordinate(pixel);
    this.posText.text = `offset   x: ${coord.x} y: ${coord.y}`;
  }

  private addDebugText(pixel: Pixel, offsetCoord: OffsetCoord) {
    const { x, y, z } = hexUtil.offsetCoordToCubeCoord(offsetCoord);
    this.add
      .text(pixel.x + 32, pixel.y + 32, `(${x},${y},${z})`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: 10,
      })
      .setOrigin(0.5, 0.5);
  }

  private renderGameState(gameState: GameState) {
    console.log("rendering game state");
    console.log(gameState);
    this.activePlayerText.setText(`ActivePlayer: ${gameState.activePlayerId}`);
    gameState.units.forEach((unit) => this.renderUnit(unit));
  }

  private renderUnit(unit: Unit) {
    const offsetCoord = hexUtil.cubeCoordToOffsetCoord(unit.position);
    const pixel = this.hexMap.offsetCoordinateToPixel(offsetCoord);

    const renderedUnit = this.add
      .sprite(pixel.x, pixel.y, unit.spec.spriteName)
      .setScale(2)
      .setOrigin(0, 0);

    this.renderedUnits.set(unit.id, renderedUnit);
  }
}
