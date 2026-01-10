// objects/stations/fridge.ts
import * as THREE from "three";
import { Station } from "./station.js";
import { StationContext } from "../types.js";
import { ThreeRenderer } from "../../core/render.js";
import { Player } from "../player.js";
import { Controller } from "../../core/controller.js";
import { FridgeItem, FridgeMenu } from "../../utilities/fridgeMenu.js";
import { RiceItem } from "../recipes/rice.js";

export class Fridge extends Station {
  private suppressPrompt = false;
  private menu: FridgeMenu;

  private player: Player | null = null;
  private three: ThreeRenderer;

  private items: FridgeItem[] = [
    { id: "Rice", iconSrc: "/public/riceIcon.png" },
    { id: "Salmon", iconSrc: "/public/SalmonIcon.png" },
  ];

  constructor(
    anchor: THREE.Object3D,
    private ricePrefab: THREE.Object3D,
    private salmonPrefab: THREE.Object3D,
    three: ThreeRenderer
  ) {
    super(anchor);
    this.three = three;
    this.menu = new FridgeMenu(this.items);

    this.menu.setOnClose((picked) => {
      this.suppressPrompt = false;

      if (this.player) this.player.movementDisabled = false;

      if (picked && this.player) {
        if (picked === "Rice") {
          const obj = this.ricePrefab.clone(true);
          const item = new RiceItem(this.three, obj, 0, 0, 0);
          this.player.pickup(item);
        }
        if (picked === "Salmon") {
          const obj = this.salmonPrefab.clone(true);
          // spawn SalmonItem here
        }
      }
    });
  }

  // capture current player each frame + block prompt/opening when holding
  public override tick(
    dt: number,
    controller: Controller,
    playerWorldPos: THREE.Vector3,
    ctx: StationContext,
    player: Player,
    three: ThreeRenderer
  ) {
    this.player = player;

    const inside = this.containsPoint(playerWorldPos);
    const holdingItem = player.hasHeldItem();

    // hide prompt when holding item near fridge OR when menu open
    this.suppressPrompt = (inside && holdingItem) || this.menu.isOpen();

    // if menu is open, don't run station cancel/progress logic
    if (this.menu.isOpen()) return;

    // prevent starting fridge if holding something
    if (holdingItem) {
      super.cancel(three, player);
      return;
    }

    // normal station behaviour (progress bar -> onComplete)
    super.tick(dt, controller, playerWorldPos, ctx, player, three,true);
  }

  public prompt(): string {
    if (this.suppressPrompt) return "";
    return "Press E to open fridge";
  }

  protected override onBegin(_ctx: StationContext): void {}

  protected override useAnimation(_three: ThreeRenderer, _player: Player): void {}

  protected override onComplete(_ctx: StationContext, player: Player, _three: ThreeRenderer): void {
    this.suppressPrompt = true;
    this.player = player;

    player.movementDisabled = true;
    this.menu.open();
  }

  protected override onCancel(_three: ThreeRenderer, _player: Player): void {
    if (this.menu.isOpen()) return;
    this.suppressPrompt = false;
  }
}
