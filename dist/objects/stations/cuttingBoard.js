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
    useAnimation(three, player) {
        three.switchPlayerVariant("knife");
        player.startAction("Chop_Loop", 1.25);
    }
    onComplete(ctx, three) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        three.switchPlayerVariant("default");
        // TODO: convert ingredient -> chopped ingredient
    }
    onCancel(three, player) {
        three.switchPlayerVariant("default");
        player.stopAction();
    }
}
//# sourceMappingURL=cuttingBoard.js.map