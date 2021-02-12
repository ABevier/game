import { CubeCoord } from "./coords";

export const coordToKey = (coord: CubeCoord) => {
  return coord.x + "," + coord.y + "," + coord.z;
};

export const coordToString = (coord: CubeCoord) => {
  return `(${coordToKey(coord)})`;
};
