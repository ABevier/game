import { Game } from "phaser";
import { GameState, Unit, UnitSpec } from "./gameState";
import HexMap, { OffsetCoord, Pixel } from "./hexMap";
import hexUtil from "./hexUtil";
import { isEqual, keyBy } from "lodash";

// hex tiles: https://opengameart.org/content/hex-tileset-pack
// used Piskel (piskelappcom)

export class MainScene extends Phaser.Scene {
  private text: Phaser.GameObjects.Text;
  private posText: Phaser.GameObjects.Text;

  private hexMap: HexMap;

  private gameState: GameState;

  private renderedUnits = new Map<string, Phaser.GameObjects.Sprite>();

  public preload() {
    console.log("preload main scene");
    this.load.image("hex", "assets/hex.png");

    this.load.image("knight", "assets/Knight.png");
    this.load.image("warrior", "assets/Warrior.png");
  }

  public create() {
    console.log("create main scene");

    this.text = this.add.text(700, 10, "pixel");
    this.posText = this.add.text(700, 25, "offset coord");

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

    // Game setup stuff
    this.gameState = new GameState();

    const unit1 = new Unit("1", new UnitSpec("knight"));
    unit1.position = { x: 1, y: -2, z: 1 };

    const unit2 = new Unit("2", new UnitSpec("warrior"));
    unit2.position = { x: 3, y: -4, z: 1 };

    this.gameState.units = [unit1, unit2];

    this.renderGameState(this.gameState);

    //Touch stuff
    this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
      //TODO: refactor to new function
      const pixel = { x: pointer.worldX, y: pointer.worldY };

      const offsetCoord = this.hexMap.pixelToOffsetCoordinate(pixel);
      const cubeCoord = hexUtil.offsetCoordToCubeCoord(offsetCoord);

      console.log(
        `pointer up: pixel:${pixel.x}, ${pixel.y} offset:${offsetCoord.x}, ${offsetCoord.y} cube:${cubeCoord.x}, ${cubeCoord.y}, ${cubeCoord.z}}`
      );

      //consider not using lodash for this and just making CubeCoord a class?
      const found = this.gameState.units.find((unit) =>
        isEqual(unit.position, cubeCoord)
      );

      if (found) {
        console.log(
          `clicked on unit with id:${found.id} and sprite:${found.spec.spriteName}`
        );
      }
    });
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

  public update() {
    const pixel = {
      x: this.game.input.mousePointer.worldX,
      y: this.game.input.mousePointer.worldY,
    };

    this.text.text = `pixel    x: ${pixel.x} y: ${pixel.y}`;

    const coord = this.hexMap.pixelToOffsetCoordinate(pixel);
    this.posText.text = `offset   x: ${coord.x} y: ${coord.y}`;
  }

  private renderGameState(gameState: GameState) {
    console.log("rendering game state");
    gameState.units.forEach(this.renderUnit);
  }

  private renderUnit = (unit: Unit) => {
    const offsetCoord = hexUtil.cubeCoordToOffsetCoord(unit.position);
    const pixel = this.hexMap.offsetCoordinateToPixel(offsetCoord);

    const renderedUnit = this.add
      .sprite(pixel.x, pixel.y, unit.spec.spriteName)
      .setScale(2)
      .setOrigin(0, 0);

    this.renderedUnits.set(unit.id, renderedUnit);
  };
}
