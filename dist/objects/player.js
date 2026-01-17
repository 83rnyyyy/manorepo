// objects/player.ts
import * as THREE from "three";
import { Capsule } from "three/examples/jsm/math/Capsule.js";
export class Player {
    controller;
    bounds;
    world;
    movementDisabled = false;
    object;
    moveSpeed = 6;
    collider;
    capsuleRadius = 0.35;
    capsuleHeight = 1.3;
    groundY = 0;
    animator;
    modelYawOffset = 0; // try Math.PI, Math.PI/2, -Math.PI/2 if needed
    held = null;
    holdSocket = new THREE.Object3D();
    actionName = null;
    actionTimeLeft = 0;
    // true = instant, false = smooth
    turnSpeed = 18; // rad/sec if snapTurn=false
    constructor(object, controller, bounds, world, animator) {
        this.controller = controller;
        this.bounds = bounds;
        this.world = world;
        this.animator = animator;
        this.object = object;
        this.controller.addButton("KeyE");
        this.controller.addButton("KeyW");
        this.controller.addButton("KeyA");
        this.controller.addButton("KeyS");
        this.controller.addButton("KeyD");
        this.controller.addButton("KeyQ");
        // create capsule at current player position
        const p = this.object.position.clone();
        const radius = 0.35;
        const height = 1.3; // tune
        const start = p.clone().add(new THREE.Vector3(0, radius, 0));
        const end = p.clone().add(new THREE.Vector3(0, radius + height, 0));
        this.collider = new Capsule(start, end, radius);
        this.bindHoldSocket();
    }
    startAction(name, durationSec) {
        this.actionName = name;
        this.actionTimeLeft = durationSec;
        this.animator.set(name);
    }
    getHeldItem() {
        return this.held;
    }
    getWorldPos(out = new THREE.Vector3()) {
        return this.object.getWorldPosition(out);
    }
    removeHeldItem() {
        if (this.held) {
            const item = this.held;
            this.held = null;
            item.object.removeFromParent();
            return item;
        }
        else
            return null;
    }
    deleteHeldItem() {
        if (this.held) {
            this.held.object.removeFromParent();
            this.held.object.traverse((o) => {
                o.geometry?.dispose?.();
                const m = o.material;
                if (Array.isArray(m))
                    m.forEach((x) => x.dispose?.());
                else
                    m?.dispose?.();
            });
        }
    }
    bindHoldSocket() {
        this.object.add(this.holdSocket);
        this.holdSocket.position.set(0.05, 1.75, 1);
    }
    pickup(item) {
        this.held = item;
        // parent item to socket
        this.holdSocket.add(item.object);
        // reset local transform so it snaps nicely
        item.object.position.set(0, 0, 0);
        item.object.rotation.set(0, 0, 0);
        // optional: scale for held look
        item.object.scale.setScalar(1);
    }
    // Place item onto an anchor (like a station surface)
    placeOn(anchor, localOffset = new THREE.Vector3(0, 1, 0), yaw = 0) {
        if (!this.held)
            return null;
        const item = this.held;
        this.held = null;
        item.object.removeFromParent();
        anchor.add(item.object);
        const off = localOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
        item.object.position.copy(off);
        item.object.rotation.set(0, yaw, 0);
        return item;
    }
    face8Dir(ix, iz, dt) {
        if (ix === 0 && iz === 0)
            return;
        let yaw = Math.atan2(ix, iz) + this.modelYawOffset;
        const step = Math.PI / 4;
        yaw = Math.round(yaw / step) * step;
        const cur = this.object.rotation.y;
        // shortest signed angle difference in [-PI, PI]
        const delta = Math.atan2(Math.sin(yaw - cur), Math.cos(yaw - cur));
        const t = Math.min(1, this.turnSpeed * dt);
        this.object.rotation.y = cur + delta * t;
    }
    throwHeld(scene, throwSpeed = 8, upSpeed = 3) {
        if (!this.held)
            return null;
        const item = this.held;
        this.held = null;
        // detach from socket -> world
        item.object.removeFromParent();
        scene.add(item.object);
        // spawn in front of player
        const p = this.getWorldPos(new THREE.Vector3());
        const yaw = this.object.rotation.y;
        const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
        item.object.position.copy(p).add(new THREE.Vector3(0, 1.2, 0)).addScaledVector(forward, 0.8);
        item.object.rotation.set(0, yaw, 0);
        // initial velocity
        const vel = forward.multiplyScalar(throwSpeed);
        vel.y = upSpeed;
        return { item, vel };
    }
    update(dt) {
        const ix = (this.controller.getButtonState("KeyD") ? 1 : 0) + (this.controller.getButtonState("KeyA") ? -1 : 0);
        const iz = (this.controller.getButtonState("KeyS") ? 1 : 0) + (this.controller.getButtonState("KeyW") ? -1 : 0);
        const moving = ix !== 0 || iz !== 0;
        // tick action timer (does NOT return early)
        if (this.actionName) {
            this.actionTimeLeft -= dt;
            if (this.actionTimeLeft <= 0)
                this.actionName = null;
        }
        if (this.movementDisabled) {
            // keep idle anim if not in a forced action
            if (!this.actionName) {
                if (this.held)
                    this.animator.set("Idle_Holding");
                else
                    this.animator.set("Idle");
            }
            return;
        }
        this.face8Dir(ix, iz, dt);
        const move = new THREE.Vector3(ix, 0, iz);
        if (move.lengthSq() > 0)
            move.normalize().multiplyScalar(this.moveSpeed * dt);
        const EPS = 1e-4;
        const MAX_ITERS = 1;
        const PUSH_FACTOR = 0.5;
        let remaining = move.clone();
        for (let iter = 0; iter < MAX_ITERS && remaining.lengthSq() > 0; iter++) {
            this.collider.translate(remaining);
            const hit = this.world.capsuleIntersect(this.collider);
            if (!hit)
                break;
            this.collider.translate(hit.normal.multiplyScalar(hit.depth * PUSH_FACTOR + EPS));
            const into = remaining.dot(hit.normal);
            if (into < 0)
                remaining.addScaledVector(hit.normal, -into);
            else
                break;
        }
        const dx = THREE.MathUtils.clamp(this.collider.start.x, this.bounds.minX, this.bounds.maxX) - this.collider.start.x;
        const dz = THREE.MathUtils.clamp(this.collider.start.z, this.bounds.minZ, this.bounds.maxZ) - this.collider.start.z;
        if (dx !== 0 || dz !== 0)
            this.collider.translate(new THREE.Vector3(dx, 0, dz));
        this.object.position.copy(this.collider.start);
        this.object.position.y = this.collider.radius;
        this.collider.start.y = this.groundY + this.capsuleRadius;
        this.collider.end.y = this.groundY + this.capsuleRadius + this.capsuleHeight;
        this.object.position.set(this.collider.start.x, this.groundY, this.collider.start.z);
        if (!this.actionName) {
            if (!moving) {
                if (this.held)
                    this.animator.set("Idle_Holding");
                else
                    this.animator.set("Idle");
            }
            else {
                if (this.held)
                    this.animator.set("Walk_Holding");
                else
                    this.animator.set("Walk");
            }
        }
    }
    stopAction() {
        this.actionName = null;
        this.actionTimeLeft = 0;
    }
}
//# sourceMappingURL=player.js.map