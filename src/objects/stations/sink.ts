// objects/stations/sink.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";

export class Sink extends Station {
  public prompt(): string {
    return "Hold E to wash";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start sound/animation
  }

  protected onComplete(ctx: StationContext): void {
    // TODO: wash item in player's hands
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Sink complete at player pos:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
  }
}
