// See:
// https://www.redblobgames.com/grids/hexagons/
// https://www.redblobgames.com/grids/hexagons/implementation.html

import { OffsetCoord, Point } from "./hexMap";

class HexUtil {
  public offsetCoordToCubeCoord(offsetCoord: Point): CubeCoord {
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
}

//TODO: get the interfaces in line
export interface CubeCoord {
  x: number;
  y: number;
  z: number;
}

export default new HexUtil();
