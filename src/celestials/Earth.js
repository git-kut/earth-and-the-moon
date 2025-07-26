import * as THREE from "three";
import earthVertexShader from "../shaders/earth/vertex.glsl";
import earthFragmentShader from "../shaders/earth/fragment.glsl";

export class Earth {
  constructor(textureLoader, parameters) {
    this.parameters = parameters;

    // Load textures
    const dayTexture = textureLoader.load("./earth/day.jpg");
    const nightTexture = textureLoader.load("./earth/night.jpg");
    const cloudsTexture = textureLoader.load("./earth/specularClouds.jpg");
    const normalTexture = textureLoader.load("./earth/earth_normal.png");

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    dayTexture.anisotropy = 8;
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.anisotropy = 8;
    cloudsTexture.anisotropy = 8;
    normalTexture.anisotropy = 8;

    const geometry = new THREE.SphereGeometry(2, 96, 96);

    this.material = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        uDayTexture: new THREE.Uniform(dayTexture),
        uNightTexture: new THREE.Uniform(nightTexture),
        uSpecularCloudsTexture: new THREE.Uniform(cloudsTexture),
        uNormalTexture: new THREE.Uniform(normalTexture),
        uSunDirection: new THREE.Uniform(new THREE.Vector3(0, 0, 1)),
        uAtmosphereDayColor: new THREE.Uniform(
          new THREE.Color(parameters.atmosphereDayColor)
        ),
        uAtmosphereTwilightColor: new THREE.Uniform(
          new THREE.Color(parameters.atmosphereTwilightColor)
        ),
      },
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
  }

  updateSunDirection(direction) {
    this.material.uniforms.uSunDirection.value.copy(direction);
  }

  updateColorUniforms(dayColor, twilightColor) {
    this.material.uniforms.uAtmosphereDayColor.value.set(dayColor);
    this.material.uniforms.uAtmosphereTwilightColor.value.set(twilightColor);
  }

  update(elapsedTime) {
    this.mesh.rotation.y = elapsedTime * 0.1;
  }

  get object3D() {
    return this.mesh;
  }
}
