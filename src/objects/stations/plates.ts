// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";

export class Plates extends Station {
  public plates: number = 4;
  public plateLocations: number[][] = [
    [-0.85,1.5,-8.69],
    [-0.85,1.6,-8.69],
    [-0.85,1.7,-8.69]
  ];
   
  public prompt(): string{
    return "Hold E to Grab Plates";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start animation/sfx
  }

  protected onComplete(ctx: StationContext): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    this.plates--;
    // TODO: convert ingredient -> chopped ingredient
  }
}
