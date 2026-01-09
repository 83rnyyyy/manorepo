// objects/stations/stationManager.ts
import * as THREE from "three";
export class StationManager {
    stations = [];
    focused = null;
    add(station) {
        this.stations.push(station);
    }
    update(dt, controller, player) {
        const p = new THREE.Vector3();
        player.getWorldPosition(p);
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
            this.focused.cancel();
        this.focused = best;
        if (this.focused) {
            const ctx = { player };
            this.focused.tick(dt, controller, p, ctx);
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