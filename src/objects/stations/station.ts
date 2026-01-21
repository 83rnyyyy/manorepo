// objects/stations/station.ts
import * as THREE from "three";
import { Controller } from "../../core/controller.js";
import { Player } from "../player.js";
import { ThreeRenderer } from "../../core/render.js";

export abstract class Station {
	public readonly anchor: THREE.Object3D;
	protected promptText: string = '';
	private interactKey: string = "KeyE";
	public holdSeconds: number = 1.0;
	public rotation: number = 0;
	
	public halfX: number = 0.7;
	private halfY: number = 1.0;
	public halfZ: number = 0.7;
	

	private box: THREE.Box3 = new THREE.Box3();
	private progress: number = 0;
	private active: boolean = false;

	constructor(anchor: THREE.Object3D) {
		this.anchor = anchor;
	}

	private updateBox(): void {
		const c = new THREE.Vector3();
		this.anchor.getWorldPosition(c);

		this.box.min.set(c.x - this.halfX, c.y - this.halfY, c.z - this.halfZ);
		this.box.max.set(c.x + this.halfX, c.y + this.halfY, c.z + this.halfZ);
	}

	public containsPoint(p: THREE.Vector3): boolean {
		this.updateBox();
		return this.box.containsPoint(p);
	}

	public getBox(): THREE.Box3 {
		this.updateBox();
		return this.box;
	}

	public getProgress(): number {
		return THREE.MathUtils.clamp(this.progress / this.holdSeconds, 0, 1);
	}

	public cancel(three:ThreeRenderer, player:Player): void {
		if (this.active) this.onCancel(three,player);
		this.active = false;
		this.progress = 0;
	}

	public tick(dt: number, playerWorldPos: THREE.Vector3, player: Player, three:ThreeRenderer): void {
		
		const inside = this.containsPoint(playerWorldPos);
		const holding = player.controller.getButtonState(this.interactKey);
	
		if (!inside || !holding) {
			this.cancel(three,player);
			return;
		}

		if (!this.active) {
			this.active = true;
			this.useAnimation(three, player);
		
		}

		this.progress += dt;

		if (this.progress >= this.holdSeconds) {
			this.progress = 0;
			this.active = false;
			this.onComplete(player, three);
		}
	}

	public abstract prompt(player?:Player): string;

	
	protected onCancel(three:ThreeRenderer, player:Player):void{};
	protected useAnimation(three:ThreeRenderer, player:Player):void {};
	protected abstract onComplete(player:Player, three:ThreeRenderer): void;
}