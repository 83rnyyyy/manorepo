import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";
import { HoldableItem } from "./holdableItem.js";
import { Assets } from "./assetManager.js";

export abstract class Cookware extends HoldableItem{
    public readonly type = 'cookware' as const;

    constructor(renderer: ThreeRenderer,x:number, y:number, z:number, name: Assets | THREE.Group){
        super(renderer, x, y, z, name);
    }
}
