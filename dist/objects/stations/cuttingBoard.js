// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class CuttingBoard extends Station {
    prompt() {
        return "Hold E to chop";
    }
    onBegin(_ctx) {
    }
    useAnimation(three, player) {
        three.switchPlayerVariant("knife");
        player.startAction("Chop_Loop", 1.25);
    }
    onComplete(ctx, player, three) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        three.switchPlayerVariant("default");
    }
    onCancel(three, player) {
        three.switchPlayerVariant("default");
        player.stopAction();
    }
}
//# sourceMappingURL=cuttingBoard.js.map