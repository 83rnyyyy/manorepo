// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";

export class CuttingBoard extends Station {
  public prompt(): string {
    return "Hold E to chop";
  }

  protected onBegin(_ctx: StationContext) {      
  
  }
  protected override useAnimation(three: ThreeRenderer, player:Player): void {
        three.switchPlayerVariant("knife");
        player.startAction("Chop_Loop", 1.25);
  }
  protected onComplete(ctx: StationContext, three:ThreeRenderer): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
	three.switchPlayerVariant("default");
    // TODO: convert ingredient -> chopped ingredient
  }

  protected override onCancel(three: ThreeRenderer,player:Player): void {
		three.switchPlayerVariant("default");
		player.stopAction();

  }
}
