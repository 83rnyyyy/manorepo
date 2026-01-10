// objects/player.ts
import * as THREE from "three";
import { Controller } from "../core/controller";
import { Bounds, PlayerAnimState } from "./types";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
import { Octree } from "three/examples/jsm/math/Octree.js";
import { PlayerAnimator } from "../utilities/playerAnimator";
import { HoldableItem } from "../utilities/holdableItem";

export class Player {
	public movementDisabled: boolean = false;
	public readonly object: THREE.Object3D;
	public moveSpeed = 6;
	public hasItem = false;
	private collider: Capsule;
  	private animator:PlayerAnimator;
	private modelYawOffset = 0; // try Math.PI, Math.PI/2, -Math.PI/2 if needed
  	private held: HoldableItem | null = null;
  	private holdSocket = new THREE.Object3D();
	private actionName: PlayerAnimState | null = null;
	private actionTimeLeft = 0;
  // optional smoothing
  	public snapTurn = false;      // true = instant, false = smooth
  	public turnSpeed = 18;       // rad/sec if snapTurn=false
  
	constructor(
		object: THREE.Object3D,
		private controller: Controller,
		private bounds: Bounds,
		private world: Octree,
		animator: PlayerAnimator,
  	){
		this.animator = animator;
		this.object = object;
		this.controller.addButton("KeyE");
		this.controller.addButton("KeyW");
		this.controller.addButton("KeyA");
		this.controller.addButton("KeyS");
		this.controller.addButton("KeyD");

		// create capsule at current player position
		const p = this.object.position.clone();
		const radius = 0.35;
		const height = 1.3; // tune
		const start = p.clone().add(new THREE.Vector3(0, radius, 0));
		const end = p.clone().add(new THREE.Vector3(0, radius + height, 0));
		this.collider = new Capsule(start, end, radius);
  	}

  	

	public startAction(name: PlayerAnimState, durationSec: number) {
    	this.actionName = name;
    	this.actionTimeLeft = durationSec;
    	this.animator.set(name); 
  	}
	public hasHeldItem(): boolean {
		return this.held !== null;
	}

	public getHeldItem(): HoldableItem | null {
		return this.held;
	}
		public getWorldPos(out = new THREE.Vector3()): THREE.Vector3 {
		return this.object.getWorldPosition(out);
	}

	public pickup(item: HoldableItem) {
		this.held = item;

		// parent item to socket
		this.holdSocket.add(item.object);

		// reset local transform so it snaps nicely
		item.object.position.set(0, 0, 0);
		item.object.rotation.set(0, 0, 0);

		// optional: scale for held look
		item.object.scale.setScalar(1);

		item.onPickup();
	}

 	public dropToWorld(scene: THREE.Scene, worldPos?: THREE.Vector3) {
		if (!this.held) return;

		const item = this.held;
		this.held = null;

		// detach: add back to scene
		scene.add(item.object);

		// place it slightly in front of player if no target provided
		const dropPos = worldPos ?? this.getWorldPos(new THREE.Vector3()).add(new THREE.Vector3(0, 0, 0.8));
		item.object.position.copy(dropPos);

		item.onDrop();
		return item;
	}

  // Place item onto an anchor (like a station surface)
	public placeOn(anchor: THREE.Object3D, localOffset = new THREE.Vector3(0, 1.0, 0)) {
		if (!this.held) return null;

		const item = this.held;
		this.held = null;

		anchor.add(item.object);
		item.object.position.copy(localOffset);
		item.object.rotation.set(0, 0, 0);

		item.onDrop();
		return item;
	}

  	private face8Dir(ix: number, iz: number, dt: number) {
    
		if (ix === 0 && iz === 0) return;

		let yaw = Math.atan2(ix, iz) + this.modelYawOffset;

		const step = Math.PI / 4;
		yaw = Math.round(yaw / step) * step;

		const cur = this.object.rotation.y;

		// shortest signed angle difference in [-PI, PI]
		const delta = Math.atan2(Math.sin(yaw - cur), Math.cos(yaw - cur));

		const t = Math.min(1, this.turnSpeed * dt);
		this.object.rotation.y = cur + delta * t;
	}

  	public update(dt: number) {
		const ix = (this.controller.getButtonState("KeyD") ? 1 : 0) + (this.controller.getButtonState("KeyA") ? -1 : 0);

		const iz = (this.controller.getButtonState("KeyS") ? 1 : 0) + (this.controller.getButtonState("KeyW") ? -1 : 0);
	
		this.face8Dir(ix,iz,dt);
		const moving = ix !== 0 || iz !== 0;

		// tick action timer (does NOT return early)
		if (this.actionName) {
			this.actionTimeLeft -= dt;
			if (this.actionTimeLeft <= 0) this.actionName = null;
		}
		
		// desired movement this frame
		const move = new THREE.Vector3(ix, 0, iz);
		if (move.lengthSq() > 0) move.normalize().multiplyScalar(this.moveSpeed * dt);

		// iterative "move + collide + slide"
		const EPS = 1e-4;
		const MAX_ITERS = 1;
		const PUSH_FACTOR = 0.5
		let remaining = move.clone();

		for (let iter = 0; iter < MAX_ITERS && remaining.lengthSq() > 0; iter++) {
			this.collider.translate(remaining);

			const hit = this.world.capsuleIntersect(this.collider);
			if (!hit) break;

			
			this.collider.translate(hit.normal.multiplyScalar(hit.depth * PUSH_FACTOR + EPS));

			
			const into = remaining.dot(hit.normal);
			if (into < 0) remaining.addScaledVector(hit.normal, -into);
			else break;
		}

		
		const dx = THREE.MathUtils.clamp(this.collider.start.x, this.bounds.minX, this.bounds.maxX) - this.collider.start.x;
		const dz = THREE.MathUtils.clamp(this.collider.start.z, this.bounds.minZ, this.bounds.maxZ) - this.collider.start.z;
		if (dx !== 0 || dz !== 0) this.collider.translate(new THREE.Vector3(dx, 0, dz));

		
		this.object.position.copy(this.collider.start);
		this.object.position.y -= this.collider.radius;
		

		if (!this.actionName) {
			if (!moving) {
				if (this.hasItem) this.animator.set("Idle_Holding");
				else this.animator.set("Idle");
			} else {
				if (this.hasItem) this.animator.set("Walk_Holding");
				else this.animator.set("Walk");
			}
		}
	}
	public stopAction() {
		this.actionName = null;
		this.actionTimeLeft = 0;
	}


}
