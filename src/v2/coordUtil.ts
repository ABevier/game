import { Core } from "phaser";
import { CubeCoord } from "./coords";

export const coordToKey = (coord: CubeCoord) => {
  return coord.x + "," + coord.y + "," + coord.z;
};
