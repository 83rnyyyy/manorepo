// objects/stations/trash.ts (optional but common)
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";

export class Trash extends Station {
  public prompt(): string {
    return "Hold E to throw away";
  }

  protected onComplete(ctx: StationContext): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Trash complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    // TODO: delete item in player's hands
  }

  
  protected override onBegin(_ctx: StationContext): void {
      
  }
}
