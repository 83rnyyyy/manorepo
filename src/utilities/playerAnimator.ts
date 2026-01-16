// objects/playerAnimator.ts
import * as THREE from "three";
import { PlayerAnimState } from "../objects/types";



export class PlayerAnimator {
	private current: THREE.AnimationAction | null = null;

	constructor(private actions: Record<string, THREE.AnimationAction>) {}

	private getAction(state: PlayerAnimState): THREE.AnimationAction | null {
		
		if (!this.actions[state]) return null;
		return this.actions[state]
		
		
	}

	public set(state: PlayerAnimState): void {
		const next = this.getAction(state);
		if (!next || next === this.current) return;

		next.reset().play();

		if (this.current) {
		this.current.crossFadeTo(next, 0.15, false);
		}

		this.current = next;
	}
}
