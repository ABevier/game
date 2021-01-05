import HexMap from "./hexMap";

export class MainScene extends Phaser.Scene {
  private text: Phaser.GameObjects.Text;
  private posText: Phaser.GameObjects.Text;

  private hexMap: HexMap;

  public preload() {
    console.log("preload main scene");
    //this.load.image("hex", "assets/grassHex.png")
    this.load.image("hex", "assets/hex.png");
  }

  public create() {
    console.log("create main scene");

    this.text = this.add.text(10, 10, "pixel");
    this.posText = this.add.text(10, 40, "coord2");

    //tile x dimensions are: 7px space, 18px edge, 7px space
    //scaled up it is: 14px, 36px, 14px
    //the offset is 7px * 18px = 25 then *2 for scale so 50px
    //the edge is 18px then *2 for scale so 32px
    let startX = 100;
    let startY = 100;
    let tileWidth = 64;
    let tileHeight = 64;
    let xEdge = 36;

    this.hexMap = new HexMap(startX, startY, tileWidth, tileHeight, xEdge);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 12; x++) {
        const pixel = this.hexMap.coordinateToPixel(x, y);
        this.add.sprite(pixel.x, pixel.y, "hex").setScale(2).setOrigin(0, 0);
      }
    }
  }

  public update() {
    const pX = this.game.input.mousePointer.worldX;
    const pY = this.game.input.mousePointer.worldY;

    this.text.text = `pixel x: ${pX} y: ${pY}`;

    const coord = this.hexMap.pixelToCoordinate(pX, pY);

    this.posText.text = `coord2 x: ${coord.x} y: ${coord.y}`;
  }
}
