// objects/stations/trash.ts (optional but common)
import * as THREE from "three";
import { Station } from "./station.js";
export class Trash extends Station {
    prompt() {
        return "Hold E to throw away";
    }
    onComplete(ctx) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Trash complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        // TODO: delete item in player's hands
    }
    useAnimation(three, player) {
    }
    onBegin(_ctx) {
    }
}
//# sourceMappingURL=trash.js.map