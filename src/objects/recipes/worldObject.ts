import * as THREE from "three";
import { ThreeRenderer } from "../../core/render.js";
export abstract class worldObject{
    constructor(protected x: number, protected y: number, protected z: number, public object: THREE.Object3D, protected renderer: ThreeRenderer){
        this.object.position.set(x,y,z);
        this.renderer.scene.add(this.object);
    }

    public deleteObject() {
        this.object.removeFromParent(); // removes from scene graph

        // optional: free GPU memory (only if you won't reuse this object)
        this.object.traverse((o: any) => {
            o.geometry?.dispose?.();
            const m = o.material;
            if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
            else m?.dispose?.();
        });
    }

}