import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";
import { HoldableItem } from "./holdableItem.js";

export abstract class Food extends HoldableItem{
    public readonly type = 'ingredient' as const;
    public isChoppable: boolean;
    public isCookable: boolean;

    constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number){
        super(renderer, object, x, y, z);
    }
}