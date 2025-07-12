// main.js
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

import { Earth } from "./celestials/Earth.js";
import { Atmosphere } from "./celestials/Atmosphere.js";
import { Moon } from "./celestials/Moon.js";
import { SunLight } from "./celestials/SunLight.js";

/**
 * Base Setup
 */
const gui = new GUI({ width: 300 });
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

/**
 * Parameters
 */
const parameters = {
  atmosphereDayColor: "#00aaff",
  atmosphereTwilightColor: "#ff6600",
};

/**
 * Celestial Objects
 */
const earth = new Earth(textureLoader, parameters);
const atmosphere = new Atmosphere(earth.mesh.geometry, parameters);
const moon = new Moon(textureLoader);
const sunLight = new SunLight(textureLoader);

scene.add(earth.mesh);
scene.add(atmosphere.mesh);
scene.add(moon.mesh);
scene.add(sunLight.light);

/**
 * GUI Controls
 */
gui
  .addColor(parameters, "atmosphereDayColor")
  .onChange((value) => {
    earth.updateColorUniforms(value, parameters.atmosphereTwilightColor);
    atmosphere.updateColorUniforms(value, parameters.atmosphereTwilightColor);
  })
  .name("AtmosphereDayColor");

gui
  .addColor(parameters, "atmosphereTwilightColor")
  .onChange((value) => {
    earth.updateColorUniforms(parameters.atmosphereDayColor, value);
    atmosphere.updateColorUniforms(parameters.atmosphereDayColor, value);
  })
  .name("AtmosphereTwilightColor");

/**
 * Sun Direction
 */
const sunSpherical = new THREE.Spherical(1, Math.PI * 0.5, 0.5);
const sunDirection = new THREE.Vector3();

const updateSun = () => {
  sunDirection.setFromSpherical(sunSpherical);

  earth.updateSunDirection(sunDirection);
  atmosphere.updateSunDirection(sunDirection);
  moon.updateSunDirection(sunDirection);
  sunLight.updateDirection(sunDirection);
};
updateSun();

gui
  .add(sunSpherical, "phi", 0, Math.PI)
  .onChange(updateSun)
  .name("LightRotationY");
gui
  .add(sunSpherical, "theta", -Math.PI, Math.PI)
  .onChange(updateSun)
  .name("LightRotationX");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(8, 3, -10);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
renderer.setClearColor("#000011");

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  earth.update(elapsedTime);
  moon.update(elapsedTime, earth.mesh.position);

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
