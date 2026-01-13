// objects/stations/stationManager.ts
import * as THREE from "three";
export class StationManager {
    three;
    stations = [];
    focused = null;
    constructor(three) {
        this.three = three;
        this.three = three;
    }
    add(station) {
        this.stations.push(station);
    }
    update(dt, controller, player, three) {
        const playerObj = player.object;
        const p = new THREE.Vector3();
        playerObj.getWorldPosition(p);
        // pick closest station that contains player
        let best = null;
        let bestDist = Infinity;
        for (const s of this.stations) {
            if (!s.containsPoint(p))
                continue;
            const c = s.getBox().getCenter(new THREE.Vector3());
            const d = p.distanceTo(c);
            if (d < bestDist) {
                bestDist = d;
                best = s;
            }
        }
        if (this.focused && this.focused !== best)
            this.focused.cancel(three, player);
        this.focused = best;
        if (this.focused) {
            const ctx = { player: playerObj };
            this.focused.tick(dt, controller, p, ctx, player, this.three);
        }
    }
    getFocused() {
        return this.focused;
    }
    getByType(ctor) {
        return this.stations.find(s => s instanceof ctor);
    }
}
//# sourceMappingURL=stationManager.js.map