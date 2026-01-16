export class worldObject {
    x;
    y;
    z;
    object;
    renderer;
    constructor(x, y, z, object, renderer) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.object = object;
        this.renderer = renderer;
        this.object.position.set(x, y, z);
        this.renderer.scene.add(this.object);
    }
    deleteObject() {
        this.object.removeFromParent(); // removes from scene graph
        // optional: free GPU memory (only if you won't reuse this object)
        this.object.traverse((o) => {
            o.geometry?.dispose?.();
            const m = o.material;
            if (Array.isArray(m))
                m.forEach((x) => x.dispose?.());
            else
                m?.dispose?.();
        });
    }
}
//# sourceMappingURL=worldObject.js.map