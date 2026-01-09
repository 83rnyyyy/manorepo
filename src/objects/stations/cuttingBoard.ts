// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";

export class CuttingBoard extends Station {
  public prompt(): string {
    return "Hold E to chop";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start animation/sfx
  }

  protected onComplete(ctx: StationContext): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    // TODO: convert ingredient -> chopped ingredient
  }
}
