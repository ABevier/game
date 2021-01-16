import { Game } from "phaser";
import { GameEngine, GameState, Player, Unit, UnitSpec } from "./gameState";
import HexMap, { OffsetCoord, Pixel } from "./hexMap";
import HexUtil, { CubeCoord } from "./hexUtil";

// hex tiles: https://opengameart.org/content/hex-tileset-pack
// used Piskel (piskelappcom)

export class MainScene extends Phaser.Scene {
  private pixelText: Phaser.GameObjects.Text;
  private posText: Phaser.GameObjects.Text;

  private hexMap: HexMap;

  private gameEngine: GameEngine;

  private activePlayerText: Phaser.GameObjects.Text;
  private renderedUnits = new Map<string, Phaser.GameObjects.Sprite>();

  constructor() {
    super("main");
  }

  public init(gameState: GameState) {
    console.log("Init with gamestate:", gameState);

    this.gameEngine = new GameEngine(gameState, (gameState) =>
      this.renderGameState(gameState)
    );
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
    this.hexMap.render(this);

    this.renderGameState(this.gameEngine.gameState);
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

  private renderGameState(gameState: GameState) {
    console.log("rendering game state");
    console.log(gameState);
    this.activePlayerText.setText(`ActivePlayer: ${gameState.activePlayerId}`);
    gameState.units.forEach((unit) => this.renderUnit(unit));

    this.collectInput();
  }

  private renderUnit(unit: Unit) {
    const sprite = this.findOrCreateUnitSprite(unit);
    const pixel = this.hexMap.cubeCoordToPixel(unit.position);
    sprite.setX(pixel.x);
    sprite.setY(pixel.y);
  }

  private findOrCreateUnitSprite(unit: Unit): Phaser.GameObjects.Sprite {
    let renderedUnit = this.renderedUnits.get(unit.id);

    if (!renderedUnit) {
      console.log(`create new unit with id: ${unit.id}`);
      renderedUnit = this.add
        .sprite(0, 0, unit.spec.spriteName)
        .setScale(2)
        .setDepth(2)
        .setOrigin(0, 0);
      this.renderedUnits.set(unit.id, renderedUnit);
    }

    return renderedUnit;
  }

  private async collectInput() {
    console.log("INPUT STATE: wait for unit click");
    let unit: Unit = null;
    let isValid = false;
    do {
      unit = await this.waitForClickedUnit();
      isValid = this.gameEngine.canActivateUnit(unit);
    } while (!isValid);

    console.log(`INPUT STATE: selected unit ${unit.id} waiting for tile`);
    const neighbors = HexUtil.getNeighbors(unit.position);
    this.hexMap.highlightTiles(this, neighbors);

    let coord = await this.waitForClickedHex();
    this.hexMap.clearHighlights();

    console.log("INPUT STATE: complete");

    this.gameEngine.takeAction(unit, coord);
  }

  //TODO: this should validate
  private async waitForClickedUnit(): Promise<Unit> {
    let unit: Unit = null;

    do {
      const cubeCoord = await this.waitForClickedHex();
      unit = this.gameEngine.findUnitAtCoordinate(cubeCoord);
    } while (!unit);

    console.log(`clicked on unit with id:${unit.id}`);
    return unit;
  }

  private waitForClickedHex(): Promise<CubeCoord> {
    return new Promise((resolve, reject) => {
      this.input.once("pointerup", (pointer: Phaser.Input.Pointer) => {
        const pixel = { x: pointer.worldX, y: pointer.worldY };
        const cubeCoord = this.hexMap.pixelToCubeCoord(pixel);

        console.log(
          `pointer up: pixel:${pixel.x}, ${pixel.y} cube:${cubeCoord.x}, ${cubeCoord.y}, ${cubeCoord.z}}`
        );

        //TODO: what to do for out of bounds!! --- this should validate
        resolve(cubeCoord);
      });
    });
  }
}
