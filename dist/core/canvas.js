// core/canvas.ts
export default class Canvas {
    static canvas;
    static setup() {
        let c = document.querySelector("canvas");
        if (!c) {
            c = document.createElement("canvas");
            document.body.appendChild(c);
        }
        document.body.style.margin = "0";
        document.body.style.overflow = "hidden";
        c.width = window.innerWidth;
        c.height = window.innerHeight;
        Canvas.canvas = c;
    }
}
//# sourceMappingURL=canvas.js.map