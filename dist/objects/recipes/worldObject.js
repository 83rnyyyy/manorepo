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
    update() {
    }
}
//# sourceMappingURL=worldObject.js.map