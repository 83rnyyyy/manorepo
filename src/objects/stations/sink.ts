// objects/stations/sink.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";

export class Sink extends Station {
  public prompt(): string {
    return "Hold E to wash";
  }

  protected onBegin() {
    // optional: start sound/animation
  }
  protected useAnimation(three:ThreeRenderer): void {
    
  }

  protected onComplete(ctx: StationContext): void {
    // TODO: wash item in player's hands
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Sink complete at player pos:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
  }

  protected override onCancel(): void {
    
  }
}
