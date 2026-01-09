
import * as THREE from "three";

export type Bounds = {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
};
export type StationContext = {
  player: THREE.Object3D;
};

export type PlayerAnimState = "Idle" | "Walk" | "Walk_Holding" | "Idle_Holding";

export type SpawnedPlayer = {
  object: THREE.Object3D;
  mixer: THREE.AnimationMixer;
  actions: Record<string, THREE.AnimationAction>;
  clips: THREE.AnimationClip[];
};