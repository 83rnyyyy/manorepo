// objects/stations/stationManager.ts
import * as THREE from "three";
import { Controller } from "../../core/controller.js";
import { Station} from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";

export class StationManager {
  public stations: Station[] = [];
  private focused: Station | null = null;
  
  constructor(private three:ThreeRenderer){
    this.three = three;
  }
  public add(station: Station) {
    this.stations.push(station);
  }

  public update(dt: number, controller: Controller, player: Player, three:ThreeRenderer) {
      const playerObj = player.object;

      const p = new THREE.Vector3();
      playerObj.getWorldPosition(p);

      // pick closest station that contains player
      let best: Station | null = null;
      let bestDist = Infinity;

      for (const s of this.stations) {
        if (!s.containsPoint(p)) continue;

        const c = s.getBox().getCenter(new THREE.Vector3());
        const d = p.distanceTo(c);

        if (d < bestDist) {
          bestDist = d;
          best = s;
        }
      }

      if (this.focused && this.focused !== best) this.focused.cancel(three,player);
      this.focused = best;

      if (this.focused) {
        const ctx: StationContext = { player: playerObj };
        this.focused.tick(dt, controller, p, ctx, player, this.three, true);
      }
}

  public getFocused(): Station | null {
    return this.focused;
  }


  public getByType<T extends Station>(ctor: new (...args: any[]) => T): T | undefined {
    return this.stations.find(s => s instanceof ctor) as T | undefined;
  }
}
