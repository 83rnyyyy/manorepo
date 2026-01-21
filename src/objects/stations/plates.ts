// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station} from "./station.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { HoldableItem } from "../../utilities/holdableItem.js";

export class Plates extends Station {
  public plates: number = 3;
  public plateLocations: number[][] = [
    [-0.85,1.9,-8.69],
    [-0.85,2,-8.69],
    [-0.85,2.1,-8.69]
  ];
  public currentItems: PlateItem[] = [];
   
  public prompt(): string{
    return "Hold E to Grab Plates";
  }

  protected onBegin() {
    // optional: start animation/sfx
  }
  private takePlate(): PlateItem | null{
    const plate = this.currentItems.pop() ?? null
    return plate;
    
    
  }
  protected onComplete(player: Player): void {
    this.plates--;
    if(this.plates !== 0 && !player.getHeldItem()){
      player.pickup(this.takePlate() as HoldableItem);
    }
    
    // TODO: convert ingredient -> chopped ingredient
  }
  public addPlate(plate: PlateItem): void{
    if(this.currentItems.length > 3) return;
    
    plate.object.position.set(this.plateLocations[this.currentItems.length]![0]!,this.plateLocations[this.currentItems.length]![1]!,this.plateLocations[this.currentItems.length]![2]!);
    this.currentItems.push(plate);
  }
}
