import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
import { Food } from "../../utilities/food.js";

export class PanItem extends Food{
    public readonly name = "pan" as const;
    public itemInPot: Food | null = null;

    public potState:number;
    constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number) {
        super(renderer,object,x,y,z);  
    
    }
  
}