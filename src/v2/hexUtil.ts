// See:
// https://www.redblobgames.com/grids/hexagons/
// https://www.redblobgames.com/grids/hexagons/implementation.html

import { CubeCoord, OffsetCoord } from "./coords";

//This class focuses on Cube Coordinates Hexes Only.  No pixel math.
class HexUtil {
  public offsetCoordToCubeCoord(offsetCoord: OffsetCoord): CubeCoord {
    const x = offsetCoord.x;
    const z = offsetCoord.y - (offsetCoord.x - (offsetCoord.x & 1)) / 2;
    const y = -x - z;

    return { x, y, z };
  }

  public cubeCoordToOffsetCoord(cubeCoord: CubeCoord): OffsetCoord {
    const x = cubeCoord.x;
    const y = cubeCoord.z + (cubeCoord.x - (cubeCoord.x & 1)) / 2;
    return { x, y };
  }

  //Note: this doesn't check for legal hexes. They could be out of bounds.
  public getNeighbors(cubeCoord: CubeCoord): CubeCoord[] {
    const { x, y, z } = cubeCoord;
    return [
      { x: x + 1, y: y - 1, z },
      { x: x + 1, y, z: z - 1 },
      { x, y: y + 1, z: z - 1 },
      { x, y: y - 1, z: z + 1 },
      { x: x - 1, y: y + 1, z },
      { x: x - 1, y, z: z + 1 },
    ];
  }
}

export default new HexUtil();
