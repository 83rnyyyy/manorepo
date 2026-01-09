// objects/stations/stove.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Stove extends Station {
    prompt() {
        return "Hold E to cook";
    }
    onBegin(_ctx) {
        // optional: start cooking animation/sfx
    }
    onComplete(ctx) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Cook complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        // TODO: cook item in pan/pot
    }
}
//# sourceMappingURL=stove.js.map