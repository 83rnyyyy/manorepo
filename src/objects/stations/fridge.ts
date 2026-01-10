// objects/stations/fridge.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";

export class Fridge extends Station {
  public prompt(): string {
    return "Hold E to grab ingredient";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: open fridge animation/sfx
  }
  protected override useAnimation(three: ThreeRenderer): void {
        
    }

  protected onComplete(ctx: StationContext): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Fridge complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    // TODO: give player an ingredient
  }
}
