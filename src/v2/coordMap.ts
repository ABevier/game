import { CubeCoord } from "./coords";
import { coordToKey } from "./coordUtil";

export default class CoordMap<T> {
  private readonly map: Map<string, T> = new Map();

  public set(coord: CubeCoord, value: T) {
    const key = coordToKey(coord);
    this.map.set(key, value);
  }

  public has(coord: CubeCoord): boolean {
    const key = coordToKey(coord);
    return this.map.has(key);
  }

  public get(coord: CubeCoord): T {
    const key = coordToKey(coord);
    return this.map.get(key);
  }

  public valuesToList(): T[] {
    return Array.from(this.map.values());
  }
}
