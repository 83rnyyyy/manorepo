// objects/items/itemManager.ts
import * as THREE from "three";
import { Controller } from "../core/controller.js";
import { Player } from "../objects/player.js";
import { HoldableItem } from "./holdableItem.js";

export class ItemManager {
  private items: HoldableItem[] = [];

  public add(item: HoldableItem) {
    this.items.push(item);
  }

  public remove(item: HoldableItem) {
    const idx = this.items.indexOf(item);
    if (idx >= 0) this.items.splice(idx, 1);
  }

  public update(_dt: number, controller: Controller, player: Player) {
    // Only try pickup when key is down
    if (!controller.getButtonState("KeyE")) return;
    if (player.getHeldItem()) return;

    const p = player.getWorldPos(new THREE.Vector3());

    // closest item within radius
    let best: HoldableItem | null = null;
    let bestDist = Infinity;

    for (const it of this.items) {
      const ip = it.getWorldPos(new THREE.Vector3());
      const d = p.distanceTo(ip);
      if (d <= it.pickupRadius && d < bestDist) {
        bestDist = d;
        best = it;
      }
    }

    if (!best) return;

    player.pickup(best);
    this.remove(best);
  }
}
