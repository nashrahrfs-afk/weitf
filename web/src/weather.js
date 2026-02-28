import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export function createAtmosphere(scene) {
  const skyGeo = new THREE.SphereGeometry(1200, 32, 20);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0x172338) },
      bottomColor: { value: new THREE.Color(0x090c12) },
    },
    vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; varying vec3 vPos; void main(){ float h = normalize(vPos).y * 0.5 + 0.5; gl_FragColor = vec4(mix(bottomColor, topColor, h), 1.0); }`,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  scene.add(sky);

  const cloudGroup = new THREE.Group();
  for (let i = 0; i < 40; i += 1) {
    const cloud = new THREE.Mesh(
      new THREE.PlaneGeometry(90 + Math.random() * 80, 40 + Math.random() * 40),
      new THREE.MeshBasicMaterial({ color: 0x728099, transparent: true, opacity: 0.09, depthWrite: false })
    );
    cloud.position.set((Math.random() - 0.5) * 1000, 160 + Math.random() * 140, (Math.random() - 0.5) * 1000);
    cloud.rotation.x = -Math.PI / 2;
    cloud.rotation.z = Math.random() * Math.PI;
    cloudGroup.add(cloud);
  }
  scene.add(cloudGroup);

  const rainCount = 3200;
  const rainGeo = new THREE.BufferGeometry();
  const rainPos = new Float32Array(rainCount * 3);
  const rainVel = new Float32Array(rainCount);
  for (let i = 0; i < rainCount; i += 1) {
    rainPos[i * 3 + 0] = (Math.random() - 0.5) * 850;
    rainPos[i * 3 + 1] = 50 + Math.random() * 350;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 850;
    rainVel[i] = 0.15 + Math.random() * 0.4;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));

  const rain = new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({ color: 0xa8bdd8, size: 0.35, transparent: true, opacity: 0.5, depthWrite: false })
  );
  scene.add(rain);

  const dustGeo = new THREE.BufferGeometry();
  const dustCount = 1800;
  const dustPos = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i += 1) {
    dustPos[i * 3 + 0] = (Math.random() - 0.5) * 400;
    dustPos[i * 3 + 1] = Math.random() * 180;
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 400;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: 0xe4dcc6, size: 0.22, transparent: true, opacity: 0.18, depthWrite: false })
  );
  scene.add(dust);

  return {
    update(time) {
      const pos = rain.geometry.attributes.position;
      for (let i = 0; i < rainCount; i += 1) {
        pos.array[i * 3 + 1] -= rainVel[i];
        if (pos.array[i * 3 + 1] < -25) {
          pos.array[i * 3 + 1] = 280 + Math.random() * 120;
        }
      }
      pos.needsUpdate = true;

      cloudGroup.position.x = Math.sin(time * 0.01) * 55;
      cloudGroup.position.z = Math.cos(time * 0.008) * 40;
      dust.rotation.y = time * 0.01;
    },
  };
}
