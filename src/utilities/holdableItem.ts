// objects/items/holdableItem.ts
import * as THREE from "three";
import { ThreeRenderer } from "../core/render.js";
import AssetManager, { Assets } from "./assetManager.js";
import { string } from "three/tsl";


export type ItemType = "ingredient" | "cookware";

export abstract class HoldableItem {
	public abstract readonly name: Assets;
	public abstract readonly type: ItemType;
	public vel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
	public radius: number = 0.35;
	public moving: boolean = false;
	public pickupRadius: number = 2;
	private scale: number = 1;
	public object: THREE.Object3D;

	constructor(protected renderer: ThreeRenderer, protected x: number = 0, protected y: number = 0, protected z: number = 0, name: Assets | THREE.Group) {
		if (typeof name === 'string') this.object = AssetManager.create(name);
		else this.object = name;

		this.object.position.set(x, y, z);
		this.object.scale.setScalar(this.scale);
		this.radius *= this.scale;
		this.pickupRadius *= this.scale;
		renderer.scene.add(this.object);
	}

	public getWorldPos(out = new THREE.Vector3()): THREE.Vector3 {
		return this.object.getWorldPosition(out);
	}

	public setWorldPos(pos: THREE.Vector3) {
		this.object.position.copy(pos);
	}
	public deleteObject() {
		this.object.removeFromParent(); // removes from scene graph

		// optional: free GPU memory (only if you won't reuse this object)
		this.object.traverse((o: any) => {
			o.geometry?.dispose?.();
			const m = o.material;
			if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
			else m?.dispose?.();
		});
	}

}
