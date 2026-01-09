// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Plates extends Station {
    plates = 4;
    plateLocations = [
        [-0.85, 1.5, -8.69],
        [-0.85, 1.6, -8.69],
        [-0.85, 1.7, -8.69]
    ];
    prompt() {
        return "Hold E to Grab Plates";
    }
    onBegin(_ctx) {
        // optional: start animation/sfx
    }
    onComplete(ctx) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        this.plates--;
        // TODO: convert ingredient -> chopped ingredient
    }
}
//# sourceMappingURL=plates.js.map