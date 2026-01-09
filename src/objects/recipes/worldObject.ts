import * as THREE from "three";
import { ThreeRenderer } from "../../core/render";
export abstract class worldObject{
    constructor(protected x: number, protected y: number, protected z: number, protected object: THREE.Object3D, protected renderer: ThreeRenderer){
        this.object.position.set(x,y,z);
        this.renderer.scene.add(this.object);
    }

    public update(){
        
    }
}