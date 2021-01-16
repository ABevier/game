import { Pixel } from "./hexMap";
import { CubeCoord } from "./hexUtil";

export default class HexSprite extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, pixel: Pixel, cubeCoordinate: CubeCoord) {
    super(scene, pixel.x, pixel.y, "hex");
    this.setScale(2);
    this.setOrigin(0, 0);
    this.addDebugText(cubeCoordinate);
  }

  private addDebugText(cubeCoord: CubeCoord) {
    const { x, y, z } = cubeCoord;
    this.scene.add
      .text(this.x + 32, this.y + 32, `(${x},${y},${z})`, {
        fontFamily: "Verdana, sans-serif",
        fontSize: 10,
      })
      .setDepth(1)
      .setOrigin(0.5, 0.5);
  }
}
