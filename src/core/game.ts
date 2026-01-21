import * as THREE from "three";
import Canvas from "./canvas.js";
import { ThreeRenderer } from "./render.js";
import { Controller } from "./controller.js";
import { Player } from "../objects/player.js";
import { Bounds} from "../objects/types.js";
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
import { PlateItem } from "../objects/recipes/plate.js";
import { Counter } from "../objects/stations/counter.js";
import { PotItem } from "../objects/recipes/pot.js";
import { HoldableItem } from "../utilities/holdableItem.js";
import AssetManager from "../utilities/assetManager.js";
import { Serving } from "../objects/stations/serving.js";
import { Capsule } from "three/examples/jsm/Addons.js";

export class Game {
	private three: ThreeRenderer;
	private player: Player;
	private stationManager:StationManager;
	private progressUI = new ProgressBar();
	private clock = new THREE.Clock();
	private thrown: HoldableItem[] = [];
	
	private bounds: Bounds = { minX: 0, maxX: 0, minZ: 0, maxZ: 0 };
	public levels: number = 0;
	private boundsRect!: THREE.Line;	
	
	private world = new Octree();
	private mapObj!: THREE.Object3D;

	
	private stations: Station[] = [];
	private stationHelpers: THREE.Box3Helper[] = [];


	constructor() {
		void this.init();
	}

	private async init():Promise<void> {
		const canvas = Canvas.canvas;
		this.three = new ThreeRenderer(canvas);
		this.stationManager = new StationManager(this.three);
		this.mapObj = await this.three.loadGLB("/public/test7.glb");
		this.createStations();
		this.createStationDebugHelpers();
		this.world.clear();
		this.world.fromGraphNode(this.mapObj);

		this.bounds = this.computeBoundsFromMap(this.mapObj, 1.0);
		this.player = await this.createPlayer();

		this.boundsRect = this.createBoundsRectangle(this.bounds, 0.05);
		this.three.scene.add(this.boundsRect);

		

		
		
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

	


	private async createPlayer():Promise<Player>{
		const playerObj = await this.three.spawnPlayer("/public/Panda.glb", new THREE.Vector3(0, 0, 0));
		this.three.addPlayerVariant("knife", "/public/Panda_Knife.glb");
		this.three.addPlayerVariant("cooking", "/public/Panda_Pan.glb");
		let animator = new PlayerAnimator(this.three.playerActions);
		let controller: Controller = new Controller;
		controller.addButton("KeyE");
		controller.addButton("KeyW");
		controller.addButton("KeyA");
		controller.addButton("KeyS");
		controller.addButton("KeyD");
		controller.addButton("KeyQ");
		controller.addButton("KeyF");

		const p:THREE.Vector3 = playerObj.position.clone();
		const radius = 0.35;
		const height = 1.3;
		const start = p.clone().add(new THREE.Vector3(0, radius, 0));
		const end = p.clone().add(new THREE.Vector3(0, radius + height, 0));
		let collider:Capsule = new Capsule(start, end, radius);
		let player:Player = new Player(playerObj, controller, this.bounds, this.world, animator, collider);
		player.bindHoldSocket();
		return player; 
	}
	private update(dt: number): void {
		
		
	
		this.updateThrownItems(dt);
		this.player.update(dt,this.three,this.thrown);
		
		this.three.playerMixer.update(dt);
		
		this.stationManager.update(dt, this.player, this.three);
		this.updateStationDebugHelpers();
		
		const focused = this.stationManager.focused;
		const stationText = focused ? focused.prompt(this.player) : "";

		
		

		
		if (focused) {
			const text = stationText;
			if (text && text.trim().length > 0) {
			this.progressUI.show(text);
			this.progressUI.setProgress(focused.getProgress());
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

	
	private createStations(): void {
		const sinkAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(16.66, 0.29, -11.81));
		const boardAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(11, 0.5, -4.59));
		const stoveAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(18.71, 0.50, -11.44));
		const fridgeAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(20.99, 0.12, -11.50));
		const trashAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(7.87, 0.46, -8.90));
		const platesAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(15.09, 0.23, -11.86));

		const counterAnchor1 = this.makeAnchor(this.mapObj, new THREE.Vector3(13.24, 0.61, -2.70));
		const counterAnchor2 = this.makeAnchor(this.mapObj, new THREE.Vector3(15.21, 0.61, -2.72));
		const counterAnchor3 = this.makeAnchor(this.mapObj, new THREE.Vector3(13.24, 0.61, -2.70));
		const counterAnchor4 = this.makeAnchor(this.mapObj, new THREE.Vector3(17.02, 0.61, -2.69));
		const counterAnchor5 = this.makeAnchor(this.mapObj, new THREE.Vector3(20.23, 0.61, -3.27));
		const counterAnchor6 = this.makeAnchor(this.mapObj, new THREE.Vector3(14.03, 0.61, -11.89));
		const counterAnchor7 = this.makeAnchor(this.mapObj, new THREE.Vector3(18.6, 0.61, -2.69));

		const servingAnchor = this.makeAnchor(this.mapObj, new THREE.Vector3(16, 0.47, 0.77));

		const sink = new Sink(sinkAnchor);
		sink.halfX = 0.6;
		sink.halfZ = 0.6;
		sink.holdSeconds = 1.2;
		sink.rotation = 0;
		this.stationManager.add(sink);

		const board = new CuttingBoard(boardAnchor);
		board.halfX = 0.8;
		board.halfZ = 1.2;
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
		trash.holdSeconds = 0.8; 
		trash.rotation = 0;
		this.stationManager.add(trash);

		const plates = new Plates(platesAnchor);
		plates.halfX = 0.6;
		plates.halfZ = 0.75;
		plates.holdSeconds = 0.8; 
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

		const counter7 = new Counter(counterAnchor7);
		counter7.halfX = 0.6;
		counter7.halfZ = 0.6;
		counter7.rotation = Math.PI * 3 / 2;
		this.stationManager.add(counter7);

		const serving = new Serving(servingAnchor);
		serving.halfX = 6.5;
		serving.halfZ = 2;
		serving.holdSeconds = 0.2;


		this.stationManager.add(serving);
		this.stations = [sink, board, stove, fridge, trash, plates, counter1, counter2, counter3, counter4, counter5, counter6, counter7, serving];
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
	

	private makeAnchor(mapRoot: THREE.Object3D, localPos: THREE.Vector3): THREE.Object3D {
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

	
	private updateThrownItems(dt: number): void {
  const GRAVITY = -10;
  const SKIN = 1e-3;

  // make this less strict so slightly slanted floor triangles still count as "ground"
  const GROUND_NORMAL_Y = 0.55;

  for (let i = this.thrown.length - 1; i >= 0; i--) {
    const t = this.thrown[i]!;
    if (!t.moving) continue;

    // despawn if it fell far below
    if (t.object.position.y < -50) {
      t.deleteObject();
      this.thrown.splice(i, 1);
      continue;
    }

    // dynamic substeps to avoid tunneling
    const speed = t.vel.length();
    const maxMove = Math.max(0.03, t.radius * 0.5);
    const steps = Math.max(1, Math.ceil((speed * dt) / maxMove));
    const h = dt / steps;

    for (let s = 0; s < steps && t.moving; s++) {
      // integrate velocity + position
      t.vel.y += GRAVITY * h;
      t.object.position.addScaledVector(t.vel, h);

      // resolve multiple times (corners/seams)
      const MAX_ITERS = 8;
      for (let it = 0; it < MAX_ITERS; it++) {
        const sphere = new THREE.Sphere(t.object.position, t.radius);
        const hit = this.world.sphereIntersect(sphere);
        if (!hit) break;

        // push out of geometry
        t.object.position.addScaledVector(hit.normal, hit.depth + SKIN);

        // stop immediately on ground (only when falling)
        if (hit.normal.y >= GROUND_NORMAL_Y && t.vel.y <= 0) {
          t.vel.set(0, 0, 0);
          t.moving = false;
          break;
        }

        // slide on walls: remove velocity into the wall normal
        const vn = t.vel.dot(hit.normal);
        if (vn < 0) t.vel.addScaledVector(hit.normal, -vn);
      }
    }
  }
}





	}