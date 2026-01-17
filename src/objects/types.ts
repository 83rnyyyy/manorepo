
import * as THREE from "three";
import { SalmonFishItem } from "./recipes/salmonFish.js";
import { RiceItem } from "./recipes/rice.js";
import { ChoppedSalmonItem } from "./recipes/choppedSalmon.js";
import { TentacleItem } from "./recipes/tentacle.js";
import { OpenedSeaUrchinItem } from "./recipes/openSeaUrchin.js";
import { ClosedSeaUrchinItem } from "./recipes/closedSeaUrchin.js";
import { SeaweedItem } from "./recipes/seaweed.js";
import { CucumberItem } from "./recipes/cucumber.js";
import { ChoppedCucumberItem } from "./recipes/choppedCucumber.js";


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

export type Foods = SalmonFishItem | RiceItem | ChoppedSalmonItem | TentacleItem | OpenedSeaUrchinItem | ClosedSeaUrchinItem | SeaweedItem | CucumberItem | ChoppedCucumberItem;