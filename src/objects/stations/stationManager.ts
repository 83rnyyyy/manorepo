// objects/stations/stationManager.ts
import * as THREE from "three";
import { Controller } from "../../core/controller.js";
import { Station} from "./station.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";

export class StationManager {
	private stations: Station[] = [];
	private _focused: Station | null = null;
	
	constructor(private three:ThreeRenderer){
		this.three = three;
	}
	public add(station: Station): void {
		this.stations.push(station);
	}

	public update(dt: number, player: Player, three:ThreeRenderer): void {
		const p = player.getWorldPos(new THREE.Vector3());
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
		this._focused = best;
		if (this.focused) {
			this.focused.tick(dt, p, player, this.three);
		}
		console.log(this._focused);
	}

	public get focused(): Station | null {
		return this._focused;
	}


	public getByType<T extends Station>(ctor: new (...args: any[]) => T): T | undefined {
		return this.stations.find(s => s instanceof ctor) as T | undefined;
	}
}
