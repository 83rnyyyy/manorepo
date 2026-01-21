// objects/stations/sink.ts
import * as THREE from "three";
import { Station } from "./station.js";
import { Player } from "../player.js";
import { PlateItem } from "../recipes/plate.js";
import { HoldableItem } from "../../utilities/holdableItem.js";
import { Plates } from "./plates.js";

export class Sink extends Station {
	// put your real positions here (same style as Plates)
	public plateLocations: number[][] = [
		[0.65, 1.6, -9.1],
		[0.65, 1.7, -9.1],
		[0.65, 1.8, -9.1]
	];

	public currentItems: PlateItem[] = [];
	private plateStation: Plates;

	constructor(anchor: any, plateStation: Plates) {
		super(anchor);
		this.plateStation = plateStation;

	}
	public prompt(player?: Player): string {

		if (!player?.getHeldItem() && this.currentItems.length > 0) return "Hold E to Wash Plate";
	
		else return "";

	}

	private washPlate(){
		const plate = this.currentItems.pop();
		this.plateStation.addPlate(plate!)
	}

	protected onComplete(player: Player): void {
		if (!player?.getHeldItem() && this.currentItems.length > 0) {
			this.washPlate();
		}
	}

	public addPlate(plate: PlateItem): void {
		if (this.currentItems.length > 3) return;
		
		plate.object.position.set(this.plateLocations[this.currentItems.length]![0]!, this.plateLocations[this.currentItems.length]![1]!, this.plateLocations[this.currentItems.length]![2]!);
		this.currentItems.push(plate);
	}
}
