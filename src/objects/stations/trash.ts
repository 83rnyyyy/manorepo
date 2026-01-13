// objects/stations/trash.ts (optional but common)
import * as THREE from "three";
import { Station} from "./station.js";
import { StationContext } from "../types.js";

import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { PotItem } from "../recipes/pot.js";

export class Trash extends Station {
  public prompt(): string {
    return "Hold E to throw away";
  }

  protected onComplete(ctx: StationContext, player: Player): void {
    const p = new THREE.Vector3();
    ctx.player.getWorldPosition(p);
    console.log("Trash complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    if(player.getHeldItem()){
      const heldItem = player.getHeldItem();
      if(heldItem!.type === 'plate'){
        (heldItem as PlateItem).clearIngredients();
      }
      else if(heldItem?.type == "pot"){
        const pot = heldItem as PotItem;
        pot.swapToEmpty();
      }
      else{
        player.deleteHeldItem();
        
      }
    }
    // TODO: delete item in player's hands
  }

  
  protected override onBegin(_ctx: StationContext): void {
      
  }
}