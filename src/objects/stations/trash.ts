// objects/stations/trash.ts (optional but common)
import * as THREE from "three";
import { Station} from "./station.js";


import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { PotItem } from "../recipes/pot.js";

export class Trash extends Station {
  public prompt(): string {
    return "Hold E to throw away";
  }

  protected onComplete( player: Player): void {
    
    if(player.getHeldItem()){
      const heldItem = player.getHeldItem();
      if(heldItem instanceof PlateItem){
        (heldItem).clearIngredients();
      }
      else if(heldItem instanceof PotItem){
        const pot = heldItem;
        pot.swapToEmpty();
      }
      else{
        player.deleteHeldItem();
        
      }
    }
    
  }

  
  
}