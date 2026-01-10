// objects/stations/fridge.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Fridge extends Station {
    prompt() {
        return "Hold E to grab ingredient";
    }
    onBegin(_ctx) {
        // optional: open fridge animation/sfx
    }
    useAnimation(three) {
    }
    onComplete(ctx) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Fridge complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        // TODO: give player an ingredient
    }
}
//# sourceMappingURL=fridge.js.map