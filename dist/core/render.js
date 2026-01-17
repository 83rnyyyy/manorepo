// ThreeRenderer.ts (drop-in replacement)
// Keeps your existing API: spawnPlayer(url,pos), loadGLB, render, destroy.
// Adds: addPlayerVariant(name,url) and switchPlayerVariant(name)
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export class ThreeRenderer {
    canvas;
    scene;
    camera;
    renderer;
    controls;
    player = null;
    // ===== your existing fields =====
    playerMixer;
    playerClips = [];
    playerActions = {};
    // ===============================
    // ===== NEW: variants =====
    variants = {};
    activeVariant = "default";
    // ========================
    constructor(canvas) {
        this.canvas = canvas;
        this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x111111);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(5, 2, 60);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dir = new THREE.DirectionalLight(0xffffff, 1.0);
        dir.position.set(3, 5, 2);
        this.scene.add(dir);
        window.addEventListener("resize", this.onResize);
    }
    onResize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls.update();
    };
    clearActionsObject(obj) {
        for (const k of Object.keys(obj))
            delete obj[k];
    }
    async loadVariant(url, parent) {
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.load(url, (g) => resolve(g), undefined, reject);
        });
        const obj = gltf.scene;
        obj.scale.setScalar(1);
        obj.position.set(0, 0, 0);
        obj.rotation.set(0, 0, 0);
        obj.visible = false;
        parent.add(obj);
        const mixer = new THREE.AnimationMixer(obj);
        const clips = gltf.animations ?? [];
        const actions = {};
        for (const clip of clips)
            actions[clip.name] = mixer.clipAction(clip);
        return { obj, mixer, clips, actions };
    }
    applyVariant(name) {
        const next = this.variants[name];
        if (!next)
            throw new Error(`Variant "${name}" not loaded`);
        // hide current, show next
        const cur = this.variants[this.activeVariant];
        if (cur)
            cur.obj.visible = false;
        next.obj.visible = true;
        this.activeVariant = name;
        // swap "active" mixer/clips and mutate the SAME actions object (important)
        this.playerMixer = next.mixer;
        this.playerClips = next.clips;
        this.clearActionsObject(this.playerActions);
        Object.assign(this.playerActions, next.actions);
    }
    async spawnPlayer(url, pos) {
        // create root once
        const root = new THREE.Object3D();
        root.position.copy(pos);
        this.scene.add(root);
        this.player = root;
        // load default variant into root
        this.variants = {};
        this.activeVariant = "default";
        this.variants["default"] = await this.loadVariant(url, root);
        // show default + expose mixer/actions like before
        this.applyVariant("default");
        return root;
    }
    // ===== NEW: load additional player model variants into the same root =====
    async addPlayerVariant(name, url) {
        if (!this.player)
            throw new Error("Call spawnPlayer(...) before addPlayerVariant(...)");
        if (this.variants[name])
            return; // already loaded
        this.variants[name] = await this.loadVariant(url, this.player);
    }
    // ===== NEW: switch between already-loaded variants =====
    switchPlayerVariant(name) {
        if (!this.variants[name])
            throw new Error(`Variant "${name}" not loaded`);
        if (name === this.activeVariant)
            return;
        this.applyVariant(name);
    }
    loadGLB(url) {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, (gltf) => {
                const model = gltf.scene;
                this.scene.add(model);
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                model.position.y += 2;
                this.controls.target.set(0, 0, 0);
                this.controls.update();
                resolve(model);
            }, undefined, reject);
        });
    }
    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    destroy() {
        window.removeEventListener("resize", this.onResize);
        this.controls.dispose();
        this.renderer.dispose();
    }
}
//# sourceMappingURL=render.js.map