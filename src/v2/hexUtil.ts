// See:
// https://www.redblobgames.com/grids/hexagons/
// https://www.redblobgames.com/grids/hexagons/implementation.html

import { Point } from "./hexMap";

class HexUtil {
  public offsetCoordToCubeCoord(offsetCoord: Point): CubeCoord {
    const x = offsetCoord.x;
    const z = offsetCoord.y - (offsetCoord.x - (offsetCoord.x & 1)) / 2;
    const y = -x - z;

    return { x, y, z };
  }
}

//TODO: get the interfaces in line
interface CubeCoord {
  x: number;
  y: number;
  z: number;
}

export default new HexUtil();
