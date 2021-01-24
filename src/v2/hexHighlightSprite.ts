import { CubeCoord, Pixel } from "./coords";

export default class HexHighlightSprite extends Phaser.GameObjects.Sprite {
  constructor(
    scene: Phaser.Scene,
    pixel: Pixel,
    public readonly cubeCoord: CubeCoord
  ) {
    super(scene, pixel.x, pixel.y, "hex_highlight");

    this.setScale(2);
    this.setOrigin(0, 0);
    this.setAlpha(0.25);
  }
}
