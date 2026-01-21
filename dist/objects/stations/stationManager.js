// objects/stations/stationManager.ts
import * as THREE from "three";
export class StationManager {
    three;
    stations = [];
    _focused = null;
    constructor(three) {
        this.three = three;
        this.three = three;
    }
    add(station) {
        this.stations.push(station);
    }
    update(dt, player, three) {
        const p = player.getWorldPos(new THREE.Vector3());
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
        this._focused = best;
        if (this.focused) {
            this.focused.tick(dt, p, player, this.three);
        }
        console.log(this._focused);
    }
    get focused() {
        return this._focused;
    }
    getByType(ctor) {
        return this.stations.find(s => s instanceof ctor);
    }
}
//# sourceMappingURL=stationManager.js.map