// objects/stations/stove.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { PotItem } from "../recipes/pot.js";

export class Stove extends Station {
    public hasItem = true;
    public heldItem: HoldableItem | null;
    public cookwareLoc:number[] = [2.7,1.6,-8.69]
  private player:Player;
  
  public prompt(player:Player): string {
      if(!player.hasHeldItem() && this.hasItem) return "Hold E to pick up";
      else if(player.hasHeldItem() && player.getHeldItem()?.type == "pot" || player.getHeldItem()?.type == "pan") return "Hold E to place Item";
      return "Hold E to cook";
  }

  protected onBegin(_ctx: StationContext) {
    // optional: start cooking animation/sfx
  }
  

  protected onComplete(ctx: StationContext, player:Player): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Cook complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    if(this.hasItem){

          if(this.hasItem)
          if(player.hasHeldItem() && player.getHeldItem()!.type == "Rice") return;
          player.pickup(this.heldItem!);
          this.heldItem = null;
          this.hasItem = false;
        }
        else{
          this.heldItem = player.placeOn(this.anchor, new THREE.Vector3(0, 1.5, -1.1), this.rotation);
          this.hasItem = true;
    }
    // TODO: cook item in pan/pot
  }
}
