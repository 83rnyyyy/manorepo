import * as THREE from "three";
import Canvas from "./canvas.js";
import { ThreeRenderer } from "./render.js";
import { Controller } from "./controller.js";
import { Player } from "../objects/player.js";
import { Bounds, SpawnedPlayer } from "../objects/types.js";
import { Octree } from "three/examples/jsm/math/Octree.js";
import { StationManager } from "../objects/stations/stationManager.js";
import { ProgressBar } from "../utilities/progressBar.js";

import { Sink } from "../objects/stations/sink.js";
import { CuttingBoard } from "../objects/stations/cuttingBoard.js";
import { Fridge } from "../objects/stations/fridge.js";
import { Stove } from "../objects/stations/stove.js";
import { Station } from "../objects/stations/station.js";
import { Trash } from "../objects/stations/trash.js";
import { PlayerAnimator } from "../utilities/playerAnimator.js";
import { Plates } from "../objects/stations/plates.js";
import { ItemManager } from "../utilities/itemManager.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { PlateItem } from "../objects/recipes/plate.js";
import { Counter } from "../objects/stations/counter.js";
import { PotItem } from "../objects/recipes/pot.js";
import { HoldableItem } from "../utilities/holdableItem.js";
import AssetManager from "../utilities/assetManager.js";
import { Serving } from "../objects/stations/serving.js";

export class Game {
	private three: ThreeRenderer;
	private controller: Controller;
	private player: Player;
	private stationManager:StationManager;
	private progressUI = new ProgressBar();
	private clock = new THREE.Clock();
	private thrown: { item: HoldableItem; vel: THREE.Vector3; radius: number; sleeping: boolean }[] = [];
	private wasThrowDown = false;
	private wasEDown = false;
	private bounds: Bounds = { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
	public levels: number = 0;
	private boundsRect!: THREE.Line;
	private boundsBox!: THREE.LineSegments;
		
	private animator!: PlayerAnimator;
	private world = new Octree();
	private mapObj!: THREE.Object3D;

	// ===== station debug drawing =====
	private stations: Station[] = [];
	private stationHelpers: THREE.Box3Helper[] = [];


	constructor() {
		void this.init();
	}

	private async init() {
		const canvas = Canvas.canvas;
		this.three = new ThreeRenderer(canvas);
		this.stationManager = new StationManager(this.three);
		this.controller = new Controller();
		

		const playerObj = await this.three.spawnPlayer("/public/Panda.glb", new THREE.Vector3(0, 0, 0));
		await this.three.addPlayerVariant("knife", "/public/Panda_Knife.glb");
		await this.three.addPlayerVariant("cooking", "/public/Panda_Pan.glb");
		this.animator = new PlayerAnimator(this.three.playerActions);
		this.mapObj = await this.three.loadGLB("/public/test7.glb");

		this.createStations();
		this.createStationDebugHelpers();
		this.world.clear();
		this.world.fromGraphNode(this.mapObj);

		this.bounds = this.computeBoundsFromMap(this.mapObj, 1.0);

		this.boundsRect = this.createBoundsRectangle(this.bounds, 0.05);
		this.three.scene.add(this.boundsRect);

		

		
		this.player = new Player(playerObj, this.controller, this.bounds, this.world, this.animator);
		this.clock.start();
		const plates = this.stationManager.getByType(Plates);
		for(let i = 0; i< 3; i++){
			const clonedPlate = AssetManager.create('Plate');
			const plate = new PlateItem(this.three,clonedPlate, plates!.plateLocations[i]![0]!,plates!.plateLocations[i]![1]!,plates!.plateLocations[i]![2]!);
			plates?.currentItems.push(plate);
		}

		
		const stove = this.stationManager.getByType(Stove);
		const pot = new PotItem(this.three, stove!.cookwareLoc[0]!,stove!.cookwareLoc[1]!,stove!.cookwareLoc[2]!);
		stove!.heldItem = pot;
		this.draw();
	}

	private tryPickupThrown(): boolean {
		if (this.player.getHeldItem()) return false;

		const p = this.player.getWorldPos(new THREE.Vector3());

		let bestI = -1;
		let bestD = Infinity;

		for (let i = 0; i < this.thrown.length; i++) {
			const t = this.thrown[i]!;
			const ip = t.item.object.getWorldPosition(new THREE.Vector3());
			const d = ip.distanceTo(p);

			// use item pickupRadius if you want; otherwise tune this
			const r = (t.item as any).pickupRadius ?? 0.9;

			if (d <= r && d < bestD) {
			bestD = d;
			bestI = i;
			}
		}

		if (bestI === -1) return false;

		const picked = this.thrown.splice(bestI, 1)[0]!;
		picked.item.object.removeFromParent(); // safe
		this.player.pickup(picked.item);
		return true;
	}
	private update(dt: number): void {
		const throwDown = this.player.controller.getButtonState("KeyQ");
		if (throwDown && !this.wasThrowDown) {
			const res = this.player.throwHeld(this.three.scene, 9, 3.5);
			if (res) this.thrown.push({ item: res.item, vel: res.vel, radius: 0.22, sleeping: false });
		}
		this.wasThrowDown = throwDown;

		// NEW: simulate thrown items
		this.updateThrownItems(dt);
		this.player.update(dt);
		
		this.three.playerMixer.update(dt);
		// stations
		this.stationManager.update(dt, this.controller, this.player, this.three);
		this.updateStationDebugHelpers();


		
		

		

		
		const focused = this.stationManager.getFocused();
		const stationText = focused ? focused.prompt(this.player) : "";

		// PICKUP (KeyE press) only if no station is actively prompting
		const eDown = this.controller.getButtonState("KeyE");
		if (eDown && !this.wasEDown) {
			const stationHasPrompt = !!(stationText && stationText.trim().length > 0);
			if (!stationHasPrompt) {
			this.tryPickupThrown();
			}
		}
		this.wasEDown = eDown;

		// UI (keep your existing logic)
		if (focused) {
			const text = stationText;
			if (text && text.trim().length > 0) {
			this.progressUI.show(text);
			this.progressUI.setProgress(focused.getProgress01());
			} else {
			this.progressUI.hide();
			}
		} else {
			this.progressUI.hide();
		}
	}

	private draw = () => {
		const dt = this.clock.getDelta();
		this.update(dt);

		this.three.render();
		requestAnimationFrame(this.draw);
	};

	// inside core/game.ts (Game class)
private createStations() {
  const sinkAnchor = this.makeAnchor(this.mapObj, "sinkAnchor", new THREE.Vector3(16.66, 0.29, -11.81));
  const boardAnchor = this.makeAnchor(this.mapObj, "boardAnchor", new THREE.Vector3(11, 1, -4.59));
  const stoveAnchor = this.makeAnchor(this.mapObj, "stoveAnchor", new THREE.Vector3(18.71, 0.50, -11.44));
  const fridgeAnchor = this.makeAnchor(this.mapObj, "fridgeAnchor", new THREE.Vector3(20.99, 0.12, -11.50));
  const trashAnchor = this.makeAnchor(this.mapObj, "trashAnchor", new THREE.Vector3(7.87, 0.46, -8.90));
  const platesAnchor = this.makeAnchor(this.mapObj, "platesAnchor", new THREE.Vector3(15.09, 0.23, -11.86));

  const counterAnchor1 = this.makeAnchor(this.mapObj, "counterAnchor1", new THREE.Vector3(13.24, 0.61, -2.70));
  const counterAnchor2 = this.makeAnchor(this.mapObj, "counterAnchor2", new THREE.Vector3(15.21, 0.61, -2.72));
  const counterAnchor3 = this.makeAnchor(this.mapObj, "counterAnchor3", new THREE.Vector3(13.24, 0.61, -2.70));
  const counterAnchor4 = this.makeAnchor(this.mapObj, "counterAnchor4", new THREE.Vector3(17.02, 0.61, -2.69));
  const counterAnchor5 = this.makeAnchor(this.mapObj, "counterAnchor5", new THREE.Vector3(20.23, 0.61, -3.27));
  const counterAnchor6 = this.makeAnchor(this.mapObj, "counterAnchor6", new THREE.Vector3(14.03, 0.61, -11.89));

  const servingAnchor = this.makeAnchor(this.mapObj, "servingAnchor", new THREE.Vector3(16, 0.47, 0.77));

  const sink = new Sink(sinkAnchor);
  sink.halfX = 0.6;
  sink.halfZ = 0.6;
  sink.holdSeconds = 1.2;
  sink.rotation = 0;
  this.stationManager.add(sink);

  const board = new CuttingBoard(boardAnchor);
  board.halfX = 1.25;
  board.halfZ = 1;
  board.holdSeconds = 1.0;
  board.rotation = 0;
  this.stationManager.add(board);

  const stove = new Stove(stoveAnchor);
  stove.halfX = 0.7;
  stove.halfZ = 0.7;
  stove.holdSeconds = 1.5;
  stove.rotation = 0;
  this.stationManager.add(stove);

  const fridge = new Fridge(fridgeAnchor, this.three);
  fridge.halfX = 0.7;
  fridge.halfZ = 0.7;
  fridge.holdSeconds = 0.8;
  fridge.rotation = 0;
  this.stationManager.add(fridge);

  const trash = new Trash(trashAnchor);
  trash.halfX = 0.7;
  trash.halfZ = 0.7;
  trash.holdSeconds = 0.8; // keep if you want it interactable; otherwise remove
  trash.rotation = 0;
  this.stationManager.add(trash);

  const plates = new Plates(platesAnchor);
  plates.halfX = 0.6;
  plates.halfZ = 0.75;
  plates.holdSeconds = 0.8; // keep if needed
  plates.rotation = 0;
  this.stationManager.add(plates);

  const counter1 = new Counter(counterAnchor1);
  counter1.halfX = 0.6;
  counter1.halfZ = 0.6;
  counter1.rotation = Math.PI * 3 / 2;
  this.stationManager.add(counter1);

  const counter2 = new Counter(counterAnchor2);
  counter2.halfX = 0.6;
  counter2.halfZ = 0.6;
  counter2.rotation = Math.PI * 3 / 2;
  this.stationManager.add(counter2);

  const counter3 = new Counter(counterAnchor3);
  counter3.halfX = 0.6;
  counter3.halfZ = 0.6;
  counter3.rotation = Math.PI * 3 / 2;
  this.stationManager.add(counter3);

  const counter4 = new Counter(counterAnchor4);
  counter4.halfX = 0.6;
  counter4.halfZ = 0.6;
  counter4.rotation = Math.PI * 3 / 2;
  this.stationManager.add(counter4);

  const counter5 = new Counter(counterAnchor5);
  counter5.halfX = 0.6;
  counter5.halfZ = 0.6;
  counter5.rotation = 0;
  this.stationManager.add(counter5);

  const counter6 = new Counter(counterAnchor6);
  counter6.halfX = 0.6;
  counter6.halfZ = 0.6;
  counter6.rotation = Math.PI / 2;
  this.stationManager.add(counter6);

  const serving = new Serving(servingAnchor);
  serving.halfX = 6.5;
  serving.halfZ = 2;
  serving.holdSeconds = 0.2;
  serving.rotation = 0;
  this.stationManager.add(serving);
  this.stations = [sink, board, stove, fridge, trash, plates, counter1, counter2, counter3, counter4, counter5, counter6, serving];
}


private createStationDebugHelpers() {
  // remove old if any
  for (const h of this.stationHelpers) this.three.scene.remove(h);
  this.stationHelpers = [];

  for (const s of this.stations) {
    const helper = new THREE.Box3Helper(s.getBox());
    this.stationHelpers.push(helper);
    this.three.scene.add(helper);
  }
}

private updateStationDebugHelpers() {
  // Station.getBox() mutates the same Box3; Box3Helper uses it
  for (let i = 0; i < this.stations.length; i++) {
    this.stations[i]!.getBox();           // refresh min/max from anchor
    this.stationHelpers[i]!.updateMatrixWorld(true);
  }
}
	

	private makeAnchor(mapRoot: THREE.Object3D, name: string, localPos: THREE.Vector3): THREE.Object3D {
		const a = new THREE.Object3D();
		
		a.position.copy(localPos);
		mapRoot.add(a);
		
		return a;
	}

	private computeBoundsFromMap(mapObj: THREE.Object3D, margin = 1.0): Bounds {
		const box = new THREE.Box3().setFromObject(mapObj);
		return {
		minX: box.min.x + margin,
		maxX: box.max.x - margin,
		minZ: box.min.z + margin,
		maxZ: box.max.z - margin,
		};
	}

	private createBoundsRectangle(b: Bounds, y = 2): THREE.Line {
		const pts = [
		new THREE.Vector3(b.minX, y, b.minZ),
		new THREE.Vector3(b.maxX, y, b.minZ),
		new THREE.Vector3(b.maxX, y, b.maxZ),
		new THREE.Vector3(b.minX, y, b.maxZ),
		new THREE.Vector3(b.minX, y, b.minZ),
		];
		const geom = new THREE.BufferGeometry().setFromPoints(pts);
		return new THREE.Line(geom, new THREE.LineBasicMaterial());
	}

	
	private updateThrownItems(dt: number) {
  const GRAVITY = -20;
  const EPS = 1e-3;
  const GROUND_NORMAL_Y = 0.55; // bigger = stricter "ground" check

  // substep to avoid missing the ground on big dt
  const MAX_STEP = 1 / 120;
  const steps = Math.max(1, Math.ceil(dt / MAX_STEP));
  const h = dt / steps;

  for (let i = this.thrown.length - 1; i >= 0; i--) {
    const t = this.thrown[i]!;
    if (t.item.object.position.y < -50) {
      this.thrown.splice(i, 1);
      continue;
    }
    if (t.sleeping) continue;

    for (let s = 0; s < steps && !t.sleeping; s++) {
      // integrate
      t.vel.y += GRAVITY * h;
      t.item.object.position.addScaledVector(t.vel, h);

      // collide
      const sphere = new THREE.Sphere(t.item.object.position, t.radius);
      const hit = this.world.sphereIntersect(sphere);

      if (hit) {
        // push out so it's not stuck inside geometry
        t.item.object.position.addScaledVector(hit.normal, hit.depth + EPS);

        // if it's "ground", instantly stop forever
        if (hit.normal.y >= GROUND_NORMAL_Y) {
          t.vel.set(0, 0, 0);
          t.sleeping = true;
          break;
        } else {
          // otherwise just stop moving into the surface (prevents phasing)
          const vn = t.vel.dot(hit.normal);
          if (vn < 0) t.vel.addScaledVector(hit.normal, -vn);
        }
      }
    }
  }
}


	}