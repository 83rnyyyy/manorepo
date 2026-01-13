// objects/stations/station.ts
import * as THREE from "three";
export class Station {
    anchor;
    interactKey = "KeyE";
    holdSeconds = 1.0;
    showPrompt = true;
    // axis-aligned trigger box extents around anchor
    halfX = 0.7;
    halfY = 1.0;
    halfZ = 0.7;
    rotation = 0;
    box = new THREE.Box3();
    progress = 0;
    active = false;
    constructor(anchor) {
        this.anchor = anchor;
    }
    updateBox() {
        const c = new THREE.Vector3();
        this.anchor.getWorldPosition(c);
        this.box.min.set(c.x - this.halfX, c.y - this.halfY, c.z - this.halfZ);
        this.box.max.set(c.x + this.halfX, c.y + this.halfY, c.z + this.halfZ);
    }
    containsPoint(p) {
        this.updateBox();
        return this.box.containsPoint(p);
    }
    getBox() {
        this.updateBox();
        return this.box;
    }
    getProgress01() {
        return THREE.MathUtils.clamp(this.progress / this.holdSeconds, 0, 1);
    }
    cancel(three, player) {
        if (this.active)
            this.onCancel(three, player);
        this.active = false;
        this.progress = 0;
    }
    tick(dt, controller, playerWorldPos, ctx, player, three) {
        const inside = this.containsPoint(playerWorldPos);
        const holding = controller.getButtonState(this.interactKey);
        if (!inside || !holding) {
            this.cancel(three, player);
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
    onCancel(three, player) { }
    useAnimation(three, player) { }
}
//# sourceMappingURL=station.js.map