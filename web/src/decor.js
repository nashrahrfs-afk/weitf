import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const FURNITURE_SET = [
  { name: 'Chandelier', size: [1.8, 1.2, 1.8], y: 4.8 },
  { name: 'Ivy', size: [1, 1.7, 1], y: 0.9 },
  { name: 'MarbleStatue', size: [1.4, 3.1, 1.4], y: 1.6 },
  { name: 'Radio', size: [0.8, 0.5, 0.4], y: 0.25 },
  { name: 'NeonSign', size: [2.6, 1.2, 0.2], y: 2.6 },
  { name: 'GlassPartition', size: [3.2, 2.8, 0.2], y: 1.4 },
  { name: 'WoodCabinet', size: [2.2, 1.5, 0.9], y: 0.75 },
  { name: 'LeatherCouch', size: [2.8, 1.1, 1.2], y: 0.55 },
];

export function decorateZone({ scene, zone, center, width = 46, depth = 46, seed = 0 }) {
  const group = new THREE.Group();
  group.position.copy(center);
  group.userData.zoneDecor = true;

  const rng = mulberry32(Math.floor((center.x + center.y + center.z) * 100 + seed));

  FURNITURE_SET.forEach((item, idx) => {
    const material = new THREE.MeshStandardMaterial({
      color: zone.propPalette[idx % zone.propPalette.length],
      roughness: 0.2 + rng() * 0.6,
      metalness: idx % 3 === 0 ? 0.35 : 0.08,
      emissive: item.name.includes('Neon') ? zone.accentColor : 0x000000,
      emissiveIntensity: item.name.includes('Neon') ? 0.8 : 0,
    });

    const geometry = new THREE.BoxGeometry(...item.size);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set((rng() - 0.5) * width, item.y, (rng() - 0.5) * depth);
    mesh.rotation.y = rng() * Math.PI * 2;
    mesh.userData.furnitureName = item.name;
    mesh.userData.tint = material.color.getHex();
    mesh.userData.emission = material.emissiveIntensity;
    mesh.userData.wear = material.roughness;
    group.add(mesh);
  });

  scene.add(group);
  return group;
}

function mulberry32(seed) {
  let t = seed;
  return function random() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
