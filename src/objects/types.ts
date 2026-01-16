
import * as THREE from "three";
import { SalmonFishItem } from "./recipes/salmonFish.js";
import { RiceItem } from "./recipes/rice.js";
import { ChoppedSalmonItem } from "./recipes/choppedSalmon.js";


export type Bounds = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};

export type VariantName = "default" | "knife";

export type Variant = {
  obj: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
};

export type PlayerAnimState = "Idle" | "Walk" | "Walk_Holding" | "Idle_Holding" | "Chop_Loop";

export type SpawnedPlayer = {
  object: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  clips: THREE.AnimationClip[];
};

export type Foods = SalmonFishItem | RiceItem | ChoppedSalmonItem;