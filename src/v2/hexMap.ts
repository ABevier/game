import { GameMap } from "./gameState";
import HexHighlightSprite from "./hexHighlightSprite";
import HexSprite from "./hexSprite";
import hexUtil from "./hexUtil";
import HexUtil, { CubeCoord } from "./hexUtil";

//TODO: we need some unit tests on this guy, holy carp
// This is an "odd-q" hexmap that uses "square hexes"
// Square hexes have a width that that is divided in 4 parts: 1/4 space, 1/2 edge, 1/4 space
class HexMap {
  private readonly xEdgeStart: number;
  private readonly xEdgeEnd: number;

  private readonly upperLeft: Point;
  private readonly upperRight: Point;
  private readonly left: Point;
  private readonly right: Point;
  private readonly lowerLeft: Point;
  private readonly lowerRight: Point;

  private readonly highlights: HexHighlightSprite[] = [];

  constructor(
    private xOrigin: number,
    private yOrigin: number,
    private tileWidth: number,
    private tileHeight: number,
    private xEdgeLength: number
  ) {
    //The tile is a square, this is the pixel where the edge starts
    this.xEdgeStart = Math.floor((tileWidth - xEdgeLength) / 2);
    this.xEdgeEnd = xEdgeLength + this.xEdgeStart;

    // Calculate out the 6 points on the hexagon
    this.upperLeft = { x: this.xEdgeStart, y: 0 };
    this.upperRight = { x: this.xEdgeEnd, y: 0 };
    this.left = { x: 0, y: Math.floor(tileHeight / 2) };
    this.right = { x: tileWidth, y: Math.floor(tileHeight / 2) };
    this.lowerLeft = { x: this.xEdgeStart, y: tileHeight };
    this.lowerRight = { x: this.xEdgeEnd, y: tileHeight };

    console.log(this);
  }

  public render(scene: Phaser.Scene, map: GameMap) {
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const pixel = this.offsetCoordinateToPixel({ x, y });
        const cubeCoordinate = hexUtil.offsetCoordToCubeCoord({ x, y });
        const hex = new HexSprite(scene, pixel, cubeCoordinate);
        scene.add.existing(hex);
      }
    }
  }

  public highlightTiles(scene: Phaser.Scene, coords: CubeCoord[]) {
    coords.forEach((coord) => this.highlightTile(scene, coord));
  }

  public highlightTile(scene: Phaser.Scene, cubeCoord: CubeCoord) {
    const pixel = this.cubeCoordToPixel(cubeCoord);
    const highlight = new HexHighlightSprite(scene, pixel);
    scene.add.existing(highlight);
    this.highlights.push(highlight);
  }

  public clearHighlights() {
    this.highlights.forEach((highlight) => highlight.destroy());
  }

  // Take an X,Y,Z coord or a hex and convert it to a pixel
  public cubeCoordToPixel(cubeCoord: CubeCoord): Pixel {
    const offsetCoord = HexUtil.cubeCoordToOffsetCoord(cubeCoord);
    return this.offsetCoordinateToPixel(offsetCoord);
  }

  // Take a pixel and convert it to a cube coordinate
  public pixelToCubeCoord(pixel: Pixel): CubeCoord {
    const offsetCoord = this.pixelToOffsetCoordinate(pixel);
    return HexUtil.offsetCoordToCubeCoord(offsetCoord);
  }

  // Take an X,Y coord of a hex to a pixel on the map
  public offsetCoordinateToPixel(coord: OffsetCoord): Pixel {
    let posX = coord.x * this.xEdgeEnd;
    let posY = coord.y * this.tileHeight;

    // tiles with an odd X coordinate are shifted down by half a "tile"
    if (coord.x % 2 !== 0) {
      posY += Math.floor(this.tileHeight / 2);
    }

    return { x: posX + this.xOrigin, y: posY + this.yOrigin };
  }

  //TODO: Unit test me please!!!
  // Given a pixel on the screen convert to a map coordinate
  public pixelToOffsetCoordinate(pixel: Pixel): OffsetCoord {
    //this function uses a "virtual tile" to find the x and y.  This is a repeating pattern that overlaps parts
    //of 5 hexes.  The virtual tile gives a starting point for the actual coordinate and is then offset
    //depening on where the point (xMod, yMod) falls within the virtual tile

    // a virtual tile kind of looks like this:
    //    _____
    //   |/  \_|
    //   |\__/_|

    const tilingWidth = this.tileWidth + this.xEdgeLength;

    const mapX = pixel.x - this.xOrigin;
    const mapY = pixel.y - this.yOrigin;

    //coordX and coordY are the coordinates of the "virtual tile" which then need to be offset depending on
    //where in the virtual tile the point actually is
    const coordX = Math.floor(mapX / tilingWidth) * 2;
    const coordY = Math.floor(mapY / this.tileHeight);

    //xMod an yMod are the pixel position with the tile as an origin
    const tilePoint = {
      x: Math.floor(mapX % tilingWidth),
      y: Math.floor(mapY % this.tileHeight),
    };

    //Determine the actual coordinate by offsetting the base coordinate depending on where the point is in the tile
    if (tilePoint.y < Math.floor(this.tileHeight / 2)) {
      //Top half of the "tile"
      if (this.isLeft(this.upperLeft, this.left, tilePoint)) {
        //It's to the left
        return { x: coordX - 1, y: coordY - 1 };
      } else if (this.isLeft(this.upperRight, this.right, tilePoint)) {
        // do nothing - it's in the main hex
        return { x: coordX, y: coordY };
      } else {
        //it's to the right
        return { x: coordX + 1, y: coordY - 1 };
      }
    } else {
      //bottom half of the "tile"
      if (this.isLeft(this.left, this.lowerLeft, tilePoint)) {
        // It's to the left
        return { x: coordX - 1, y: coordY };
      } else if (this.isLeft(this.right, this.lowerRight, tilePoint)) {
        // do nothing - it's in the main hex
        return { x: coordX, y: coordY };
      } else {
        // It's to the right
        return { x: coordX + 1, y: coordY };
      }
    }
  }

  // This uses cross product to determine if a point is to the left or right or a line on the coordinate plane:
  // The order of A and B doesn't matter
  // https://stackoverflow.com/questions/1560492/how-to-tell-whether-a-point-is-to-the-right-or-left-side-of-a-line#:~:text=Using%20the%20equation%20of%20the,point%20is%20on%20the%20line.
  private isLeft(a: Point, b: Point, c: Point): boolean {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
  }
}

export interface Point {
  x: number;
  y: number;
}

export interface OffsetCoord {
  x: number;
  y: number;
}

export interface Pixel {
  x: number;
  y: number;
}

export default HexMap;
