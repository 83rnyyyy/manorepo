// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class CuttingBoard extends Station {
    prompt() {
        return "Hold E to chop";
    }
    onBegin(_ctx) {
        // optional: start animation/sfx
    }
    onComplete(ctx) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        // TODO: convert ingredient -> chopped ingredient
    }
}
//# sourceMappingURL=cuttingBoard.js.map