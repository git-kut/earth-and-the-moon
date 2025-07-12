import * as THREE from "three";
import atmosphereVertexShader from "../shaders/atmosphere/vertex.glsl";
import atmosphereFragmentShader from "../shaders/atmosphere/fragment.glsl";

export class Atmosphere {
  constructor(earthGeometry, parameters) {
    this.material = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(
          new THREE.Color(parameters.atmosphereDayColor)
        ),
        uAtmosphereTwilightColor: new THREE.Uniform(
          new THREE.Color(parameters.atmosphereTwilightColor)
        ),
      },
      side: THREE.BackSide,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(earthGeometry, this.material);
    this.mesh.scale.set(1.02, 1.02, 1.02);
  }

  updateSunDirection(direction) {
    this.material.uniforms.uSunDirection.value.copy(direction);
  }

  updateColorUniforms(dayColor, twilightColor) {
    this.material.uniforms.uAtmosphereDayColor.value.set(dayColor);
    this.material.uniforms.uAtmosphereTwilightColor.value.set(twilightColor);
  }

  get object3D() {
    return this.mesh;
  }
}
