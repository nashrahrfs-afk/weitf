import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { BUILD_PIECES, ZONES } from './config.js';
import { FirstPersonController } from './player.js';
import { buildMegastructure } from './world.js';
import { decorateZone } from './decor.js';
import { createAtmosphere } from './weather.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b13);
scene.fog = new THREE.FogExp2(0x0a0e16, 0.0028);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1600);

const hemi = new THREE.HemisphereLight(0xb8c7ff, 0x111820, 0.38);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xf9e8c3, 1.4);
sun.position.set(120, 180, 90);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const colliders = [];
buildMegastructure(scene, colliders);

const controller = new FirstPersonController(camera, renderer.domElement, colliders);
const atmosphere = createAtmosphere(scene);
const ambientBodies = createAmbientBodies(scene);


const zoneLabel = document.getElementById('zone');
const pieceLabel = document.getElementById('build-piece');

const zoneKeys = ['urban', 'mori', 'marble'];
let zoneIndex = 0;
let buildPieceIndex = 0;

window.addEventListener('keydown', (e) => {
  if (e.code === 'Digit1') zoneIndex = 0;
  if (e.code === 'Digit2') zoneIndex = 1;
  if (e.code === 'Digit3') zoneIndex = 2;
  if (e.code === 'KeyB') buildPieceIndex = (buildPieceIndex + 1) % BUILD_PIECES.length;

  if (e.code === 'KeyR') {
    const zone = ZONES[zoneKeys[zoneIndex]];
    decorateZone({ scene, zone, center: controller.position.clone().setY(Math.floor(controller.position.y / 16) * 16) });
  }

  if (e.code === 'KeyE') {
    placeBuildPiece();
  }

  zoneLabel.textContent = ZONES[zoneKeys[zoneIndex]].name;
  pieceLabel.textContent = BUILD_PIECES[buildPieceIndex];
});

function placeBuildPiece() {
  const forward = new THREE.Vector3(Math.sin(controller.yaw), 0, Math.cos(controller.yaw));
  const spot = controller.position.clone().add(forward.multiplyScalar(5));
  spot.x = Math.round(spot.x / 2) * 2;
  spot.y = Math.round(spot.y / 2) * 2;
  spot.z = Math.round(spot.z / 2) * 2;

  const colors = [0x5b6573, 0x5f656f, 0x717c8a, 0x887a5e, 0x95a0b0, 0x7a6e65];
  let geo = new THREE.BoxGeometry(8, 1.2, 8);
  if (BUILD_PIECES[buildPieceIndex] === 'Wall') geo = new THREE.BoxGeometry(8, 6, 1);
  if (BUILD_PIECES[buildPieceIndex] === 'Balcony') geo = new THREE.BoxGeometry(10, 1, 5);
  if (BUILD_PIECES[buildPieceIndex] === 'StairModern') geo = new THREE.BoxGeometry(7, 2.4, 4);
  if (BUILD_PIECES[buildPieceIndex] === 'StairSpiral') geo = new THREE.CylinderGeometry(2.6, 2.6, 5.5, 16);
  if (BUILD_PIECES[buildPieceIndex] === 'Loft') geo = new THREE.BoxGeometry(12, 1.4, 12);

  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: colors[buildPieceIndex], roughness: 0.62, metalness: 0.26 })
  );
  mesh.position.copy(spot);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  colliders.push(mesh);
}

const clock = new THREE.Clock();
const flickerTargets = [];
scene.traverse((obj) => {
  if (obj.userData.flicker) flickerTargets.push(obj);
});

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.033);

  controller.update(delta);

  const t = clock.elapsedTime;
  sun.position.x = Math.sin(t * 0.05) * 180;
  sun.position.z = Math.cos(t * 0.05) * 140;
  sun.intensity = 1.0 + Math.sin(t * 0.07) * 0.35;

  atmosphere.update(t * 60);
  ambientBodies.forEach((body, idx) => {
    body.position.x += Math.sin(t * 0.45 + idx) * 0.02;
    body.position.z += Math.cos(t * 0.38 + idx) * 0.02;
    body.position.y += Math.sin(t * 1.2 + idx) * 0.01;
  });

  flickerTargets.forEach((target, idx) => {
    const pulse = 0.55 + Math.sin(t * (4 + idx)) * 0.35 + Math.random() * 0.08;
    target.material.emissiveIntensity = Math.max(0.2, pulse);
  });

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function createAmbientBodies(sceneRef) {
  const list = [];
  for (let i = 0; i < 14; i += 1) {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x9eb2c9,
      emissive: 0x375b7f,
      emissiveIntensity: 0.35,
      roughness: 0.35,
      metalness: 0.3,
      transparent: true,
      opacity: 0.66,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.45 + Math.random() * 0.45, 16, 16), mat);
    mesh.position.set((Math.random() - 0.5) * 95, 10 + Math.random() * 70, (Math.random() - 0.5) * 95);
    sceneRef.add(mesh);
    list.push(mesh);
  }
  return list;
}
