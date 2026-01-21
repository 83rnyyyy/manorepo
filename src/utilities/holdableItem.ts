// objects/items/holdableItem.ts
import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";



export type ItemType = "ingredient" | "cookware";
export type ItemName = "plate" | "pan" | "Rice" | "salmonFish" | "choppedSalmon" | "pot" |  "closedSeaUrchin" | "openedSeaUrchin" | "seaweed" | "octopus" | "octopusTentacle" | "choppedCucumber" | "cucumber";

export abstract class HoldableItem{
  public abstract readonly name: ItemName;
  public abstract readonly type: ItemType;
  public vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0); 
  public radius: number = 0.35; 
  public moving : boolean = false;
  public pickupRadius: number = 2;
  private scale:number = 1;

  constructor(renderer: ThreeRenderer, public object: THREE.Object3D , protected x:number,protected y:number,protected z:number) {
    this.object.position.set(x, y, z);
    this.object.scale.setScalar(this.scale);
    this.radius *=this.scale;
    this.pickupRadius *= this.scale;

    renderer.scene.add(this.object);
  }
  
  public deleteObject(): void {
        this.object.removeFromParent(); 

        
        this.object.traverse((o: any) => {
            o.geometry?.dispose?.();
            const m = o.material;
            if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
            else m?.dispose?.();
        });
  }

}