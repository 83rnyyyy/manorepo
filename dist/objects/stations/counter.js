// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Counter extends Station {
    hasItem = false;
    prompt() {
        return "Hold E to Place on Counter";
    }
    onBegin(_ctx) {
        // optional: start animation/sfx
    }
    useAnimation(three) {
    }
    onComplete(ctx) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        this.hasItem = true;
        // TODO: convert ingredient -> chopped ingredient
    }
}
//# sourceMappingURL=counter.js.map