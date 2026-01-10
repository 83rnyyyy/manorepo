// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";

export class Counter extends Station {
  public hasItem = false;
  public prompt(): string {
    return "Hold E to Place on Counter";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start animation/sfx
  }
  protected override useAnimation(three: ThreeRenderer): void {
        
    }
  protected onComplete(ctx: StationContext): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    this.hasItem = true;
    // TODO: convert ingredient -> chopped ingredient
  }
}
