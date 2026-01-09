// core/canvas.ts
export default class Canvas {
  public static canvas: HTMLCanvasElement;

  public static setup() {
    // use existing canvas if present, otherwise create one
    let c = document.querySelector("canvas") as HTMLCanvasElement | null;
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
