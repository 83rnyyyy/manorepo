// objects/stations/sink.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Sink extends Station {
    prompt() {
        return "Hold E to wash";
    }
    onBegin(_ctx) {
        // optional: start sound/animation
    }
    onComplete(ctx) {
        // TODO: wash item in player's hands
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Sink complete at player pos:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
    }
}
//# sourceMappingURL=sink.js.map