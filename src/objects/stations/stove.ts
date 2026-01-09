// objects/stations/stove.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";

export class Stove extends Station {
  public prompt(): string {
    return "Hold E to cook";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start cooking animation/sfx
  }

  protected onComplete(ctx: StationContext): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Cook complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    // TODO: cook item in pan/pot
  }
}
