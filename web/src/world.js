import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { FLOOR_COUNT, FLOOR_HEIGHT_STEP, FLOOR_SIZE, ZONES } from './config.js';
import { decorateZone } from './decor.js';
import { makeTiledMaterial } from './materials.js';

export function buildMegastructure(scene, colliders) {
  const building = new THREE.Group();
  scene.add(building);

  const zones = [ZONES.urban, ZONES.mori, ZONES.marble];

  for (let i = 0; i < FLOOR_COUNT; i += 1) {
    const y = i * FLOOR_HEIGHT_STEP;
    const zone = zones[i % zones.length];
    const floor = buildLayeredFloor(y, zone, i, colliders);
    building.add(floor.group);
    decorateZone({ scene: floor.group, zone, center: new THREE.Vector3(0, 0, 0), seed: i });
  }

  const rooftop = new THREE.Mesh(
    new THREE.BoxGeometry(FLOOR_SIZE, 2, FLOOR_SIZE),
    makeTiledMaterial({ base: '#2e4a34', line: '#35503a', roughness: 0.95, metalness: 0.02, repeat: [12, 12] })
  );
  rooftop.position.set(0, FLOOR_COUNT * FLOOR_HEIGHT_STEP + 2, 0);
  rooftop.receiveShadow = true;
  building.add(rooftop);
  colliders.push(rooftop);

  addOutsideCity(scene);
}

function buildLayeredFloor(baseY, zone, index, colliders) {
  const group = new THREE.Group();
  group.position.y = baseY;

  const floorBase = makeBox(FLOOR_SIZE, 2, FLOOR_SIZE, zone.floorColor, 0, 0, 0);
  group.add(floorBase);
  colliders.push(floorBase);

  const mezzanine = makeBox(42, 2, 42, shade(zone.floorColor, 0.12), -28, 5, -20);
  const mezzanine2 = makeBox(34, 2, 34, shade(zone.floorColor, 0.08), 26, 8, 18);
  group.add(mezzanine, mezzanine2);
  colliders.push(mezzanine, mezzanine2);

  const balcony = makeBox(20, 2, 9, shade(zone.floorColor, 0.16), 0, 11, -46);
  group.add(balcony);
  colliders.push(balcony);

  const hiddenCorridor = makeBox(18, 3.5, 44, 0x20252b, 48, 1.8, 0);
  group.add(hiddenCorridor);
  colliders.push(hiddenCorridor);

  const crawlSpace = makeBox(32, 1.4, 14, 0x171a1e, -46, -1.2, 38);
  group.add(crawlSpace);
  colliders.push(crawlSpace);

  makeStair(group, colliders, -8, 1, 28, 13, 0.9, zone.accentColor);
  makeStair(group, colliders, -42, 1, -26, 8, 1.2, zone.accentColor);

  const loft = makeBox(16, 1.6, 16, shade(zone.floorColor, 0.22), 38, 12, -34);
  group.add(loft);
  colliders.push(loft);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5, 8, 28),
    makeTiledMaterial({ base: '#31363f', line: '#434a56', roughness: 0.5, metalness: 0.45, repeat: [4, 4], emissive: `#${zone.accentColor.toString(16).padStart(6, '0')}`, emissiveIntensity: 0.5 })
  );
  ring.position.set(-34, 14, -34);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  addPerimeterWalls(group, zone.accentColor);

  group.userData.zone = zone;
  group.userData.floorIndex = index;

  return { group };
}

function makeStair(group, colliders, x, y, z, steps, rise, color) {
  for (let i = 0; i < steps; i += 1) {
    const tread = makeBox(7, 0.5, 2.6, color, x + i * 1.4, y + i * rise, z - i * 1.8);
    group.add(tread);
    colliders.push(tread);
  }
}

function addPerimeterWalls(group, accent) {
  const wallMat = makeTiledMaterial({ base: '#262d39', line: '#3b4350', roughness: 0.82, metalness: 0.18, repeat: [12, 3] });
  const neonMat = makeTiledMaterial({ base: '#12151a', line: '#202632', roughness: 0.4, metalness: 0.4, repeat: [2, 1], emissive: `#${accent.toString(16).padStart(6, '0')}`, emissiveIntensity: 0.9 });
  const wallA = new THREE.Mesh(new THREE.BoxGeometry(FLOOR_SIZE, 22, 2), wallMat);
  wallA.position.set(0, 11, -FLOOR_SIZE / 2 + 1);
  const wallB = wallA.clone();
  wallB.position.z *= -1;
  const wallC = new THREE.Mesh(new THREE.BoxGeometry(2, 22, FLOOR_SIZE), wallMat);
  wallC.position.set(-FLOOR_SIZE / 2 + 1, 11, 0);
  const wallD = wallC.clone();
  wallD.position.x *= -1;

  [wallA, wallB, wallC, wallD].forEach((w) => {
    w.castShadow = true;
    w.receiveShadow = true;
    group.add(w);
  });

  const neon = new THREE.Mesh(new THREE.BoxGeometry(12, 1, 0.3), neonMat);
  neon.position.set(0, 9, -FLOOR_SIZE / 2 + 2.2);
  neon.userData.flicker = true;
  group.add(neon);
}

function addOutsideCity(scene) {
  const city = new THREE.Group();
  for (let i = 0; i < 110; i += 1) {
    const h = 18 + Math.random() * 160;
    const b = new THREE.Mesh(
      new THREE.BoxGeometry(16 + Math.random() * 18, h, 16 + Math.random() * 18),
      makeTiledMaterial({ base: '#141820', line: '#1f2430', roughness: 0.95, metalness: 0.1, repeat: [2, 8] })
    );
    b.position.set((Math.random() - 0.5) * 1100, h / 2 - 30, (Math.random() - 0.5) * 1100);
    if (Math.abs(b.position.x) < 120 && Math.abs(b.position.z) < 120) continue;
    city.add(b);
  }
  scene.add(city);
}

function makeBox(w, h, d, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    makeTiledMaterial({ base: `#${color.toString(16).padStart(6,'0')}`, line: '#ffffff22', roughness: 0.72, metalness: 0.22, repeat: [6, 6] })
  );
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function shade(hex, amount) {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, amount);
  return c.getHex();
}
