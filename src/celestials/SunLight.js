import * as THREE from "three";
import {
  Lensflare,
  LensflareElement,
} from "three/examples/jsm/objects/Lensflare.js";

export class SunLight {
  constructor(textureLoader) {
    this.light = new THREE.PointLight(0xffffff, 0.0, 100);

    const lensFlare0 = textureLoader.load("./lenses/lensflare0.png");
    const lensFlare1 = textureLoader.load("./lenses/lensflare1.png");

    const lensFlare = new Lensflare();
    lensFlare.addElement(new LensflareElement(lensFlare0, 400, 0.0));
    lensFlare.addElement(new LensflareElement(lensFlare1, 90, 0.3));
    lensFlare.addElement(new LensflareElement(lensFlare1, 110, 0.6));
    lensFlare.addElement(new LensflareElement(lensFlare1, 140, 0.9));
    lensFlare.addElement(new LensflareElement(lensFlare1, 90, 1.0));

    this.light.add(lensFlare);
  }

  updateDirection(direction) {
    this.light.position.copy(direction).multiplyScalar(15);
  }

  get object3D() {
    return this.light;
  }
}
