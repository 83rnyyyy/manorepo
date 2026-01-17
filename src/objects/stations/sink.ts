// objects/stations/sink.ts
import * as THREE from "three";
import { Station} from "./station.js";

import { ThreeRenderer } from "../../core/render.js";

export class Sink extends Station {
  public prompt(): string {
    return "Hold E to wash";
  }

  
  protected override useAnimation(three:ThreeRenderer): void {
    
  }

  protected onComplete(): void {
    
    
  }

  
}
