// objects/stations/station.ts
import * as THREE from "three";
import { Controller } from "../../core/controller.js";
import { StationContext } from "../types.js";
import { Player } from "../player.js";
import { ThreeRenderer } from "../../core/render.js";

export abstract class Station {
  public readonly anchor: THREE.Object3D;

  public interactKey = "KeyE";
  public holdSeconds = 1.0;
  public showPrompt: Boolean = true;
  // axis-aligned trigger box extents around anchor
  public halfX = 0.7;
  public halfY = 1.0;
  public halfZ = 0.7;
  public rotation = 0;

  private box = new THREE.Box3();
  private progress = 0;
  private active = false;

  constructor(anchor: THREE.Object3D) {
    this.anchor = anchor;
  }

  private updateBox() {
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

  public getProgress01(): number {
    return THREE.MathUtils.clamp(this.progress / this.holdSeconds, 0, 1);
  }

  public cancel(three:ThreeRenderer, player:Player) {
    if (this.active) this.onCancel(three,player);
    this.active = false;
    this.progress = 0;
  }

  public tick(
    dt: number,
    controller: Controller,
    playerWorldPos: THREE.Vector3,
    ctx: StationContext,
    player: Player,
    three:ThreeRenderer,
    showPrompt: Boolean
  ) {
    
    const inside = this.containsPoint(playerWorldPos);
    const holding = controller.getButtonState(this.interactKey);
  
    if (!inside || !holding) {
      this.cancel(three,player);
      return;
    }

    if (!this.active) {
      this.active = true;
      this.useAnimation(three, player);
      this.onBegin(ctx);
    }

    this.progress += dt;

    if (this.progress >= this.holdSeconds) {
      this.progress = 0;
      this.active = false;
      this.onComplete(ctx, player, three);
    }
  }

  public abstract prompt(player?:Player): string;

  protected abstract onBegin(_ctx: StationContext): void
  protected onCancel(three:ThreeRenderer, player:Player):void {}
  protected useAnimation(three:ThreeRenderer, player:Player):void {}
  protected abstract onComplete(ctx: StationContext, player:Player, three:ThreeRenderer): void;
}