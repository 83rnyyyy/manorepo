// objects/stations/cuttingBoard.ts
import * as THREE from "three";
import { Station } from "./station.js";
export class Plates extends Station {
    plates = 3;
    plateLocations = [
        [-0.85, 1.5, -8.69],
        [-0.85, 1.6, -8.69],
        [-0.85, 1.7, -8.69]
    ];
    currentItems = [];
    prompt() {
        return "Hold E to Grab Plates";
    }
    onBegin(_ctx) {
    }
    takePlate() {
        const plate = this.currentItems.pop() ?? null;
        return plate;
    }
    onComplete(ctx, player) {
        const p = new THREE.Vector3();
        ctx.player.getWorldPosition(p);
        console.log("Chop complete at:", p.x.toFixed(2), p.y.toFixed(2), p.z.toFixed(2));
        if (this.plates !== 0) {
            player.pickup(this.takePlate());
        }
        this.plates--;
    }
}
//# sourceMappingURL=plates.js.map