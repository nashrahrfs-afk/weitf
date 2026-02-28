import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export function makeTiledMaterial({
  base = '#666',
  line = '#555',
  roughness = 0.8,
  metalness = 0.1,
  repeat = [16, 16],
  emissive = '#000',
  emissiveIntensity = 0,
} = {}) {
  const tex = makeCanvasTexture(base, line);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat[0], repeat[1]);

  return new THREE.MeshStandardMaterial({
    map: tex,
    roughness,
    metalness,
    emissive: new THREE.Color(emissive),
    emissiveIntensity,
  });
}

function makeCanvasTexture(base, line) {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 16) {
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  for (let x = 0; x < size; x += 16) {
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
    ctx.stroke();
  }

  for (let i = 0; i < 1400; i += 1) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const alpha = 0.03 + Math.random() * 0.09;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  return new THREE.CanvasTexture(canvas);
}
