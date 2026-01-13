// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { ItemType } from "../../utilities/holdableItem.js";

export class CuttingBoard extends Station {
	private itemPlaced: ItemType | null;
	public prompt(player:Player): string {
		if(this.itemPlaced == null && player.getHeldItem()) return "Hold E to place item";
		if(this.itemPlaced == null) return "";
		if(this.itemPlaced == "chopped_ingredient") return "Hold E to pick up";
		return "Hold E to chop";
	}

  protected onBegin(_ctx: StationContext) {      
  
  }
  protected override useAnimation(three: ThreeRenderer, player:Player): void {
        three.switchPlayerVariant("knife");
        player.startAction("Chop_Loop", 1.25);
  }
  protected onComplete(ctx: StationContext,player:Player, three:ThreeRenderer): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
	three.switchPlayerVariant("default");
	
  }

  protected override onCancel(three: ThreeRenderer,player:Player): void {
		three.switchPlayerVariant("default");
		player.stopAction();

  }
}
