import * as THREE from "three";
import moonVertexShader from "../shaders/moon/vertex.glsl";
import moonFragmentShader from "../shaders/moon/fragment.glsl";

export class Moon {
  constructor(textureLoader, moonDistance = -5) {
    const moonTexture = textureLoader.load("./moon/moon.jpg");

    this.material = new THREE.ShaderMaterial({
      vertexShader: moonVertexShader,
      fragmentShader: moonFragmentShader,
      uniforms: {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uMoonTexture: new THREE.Uniform(moonTexture),
        uMoonToEarth: new THREE.Uniform(new THREE.Vector3()),
      },
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(0.27, 16, 16);
    this.mesh = new THREE.Mesh(geometry, this.material);
    this.distance = moonDistance;
  }

  update(elapsedTime, earthPosition = new THREE.Vector3()) {
    const angle = elapsedTime * 0.02;
    const x = Math.cos(angle) * this.distance;
    const z = Math.sin(angle) * this.distance;
    this.mesh.position.set(x, 0, z);
    this.mesh.rotation.y = -angle;

    const moonToEarth = new THREE.Vector3()
      .subVectors(earthPosition, this.mesh.position)
      .normalize();
    this.material.uniforms.uMoonToEarth.value.copy(moonToEarth);
  }

  updateSunDirection(direction) {
    this.material.uniforms.uSunDirection.value.copy(direction);
  }

  get object3D() {
    return this.mesh;
  }
}
