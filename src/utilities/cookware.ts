import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";
import { HoldableItem } from "./holdableItem.js";

export abstract class Cookware extends HoldableItem{
    public readonly type = 'cookware' as const;

    constructor(renderer: ThreeRenderer, object: THREE.Object3D ,x:number, y:number, z:number){
        super(renderer, object, x, y, z);
    }
}