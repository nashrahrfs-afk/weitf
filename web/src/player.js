import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

export class FirstPersonController {
  constructor(camera, domElement, colliders) {
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;

    this.height = 1.8;
    this.radius = 0.35;
    this.velocity = new THREE.Vector3();
    this.position = new THREE.Vector3(0, 8, 0);

    this.walkSpeed = 7.2;
    this.sprintSpeed = 10.5;
    this.gravity = 25;
    this.jumpVelocity = 8.5;
    this.onGround = false;

    this.pitch = 0;
    this.yaw = 0;
    this.headBobTime = 0;

    this.keys = new Set();
    this.isLocked = false;

    this.connect();
  }

  connect() {
    this.domElement.addEventListener('click', () => this.domElement.requestPointerLock());
    document.addEventListener('pointerlockchange', () => {
      this.isLocked = document.pointerLockElement === this.domElement;
    });

    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));

    window.addEventListener('mousemove', (e) => {
      if (!this.isLocked) return;
      const sensitivity = 0.0018;
      this.yaw -= e.movementX * sensitivity;
      this.pitch -= e.movementY * sensitivity;
      this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
    });
  }

  update(delta) {
    const speed = this.keys.has('ShiftLeft') ? this.sprintSpeed : this.walkSpeed;
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);
    const wish = new THREE.Vector3();

    if (this.keys.has('KeyW')) wish.add(forward);
    if (this.keys.has('KeyS')) wish.sub(forward);
    if (this.keys.has('KeyD')) wish.add(right);
    if (this.keys.has('KeyA')) wish.sub(right);
    if (wish.lengthSq() > 0) wish.normalize();

    this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, wish.x * speed, 0.18);
    this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, wish.z * speed, 0.18);

    if (this.onGround && this.keys.has('Space')) {
      this.velocity.y = this.jumpVelocity;
      this.onGround = false;
    }

    this.velocity.y -= this.gravity * delta;

    const next = this.position.clone().addScaledVector(this.velocity, delta);
    this.onGround = false;

    const feet = next.clone();
    const ray = new THREE.Raycaster(feet, new THREE.Vector3(0, -1, 0), 0, this.height + 0.5);
    const groundHit = ray.intersectObjects(this.colliders, true)[0];
    if (groundHit) {
      const groundY = groundHit.point.y;
      const targetFeetY = groundY + this.height;
      if (next.y <= targetFeetY + 0.05) {
        next.y = targetFeetY;
        this.velocity.y = 0;
        this.onGround = true;
      }
    }

    this.position.copy(next);

    this.headBobTime += this.onGround ? delta * this.velocity.length() * 0.04 : 0;
    const bob = this.onGround ? Math.sin(this.headBobTime) * 0.018 : 0;

    this.camera.position.set(this.position.x, this.position.y + bob, this.position.z);
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }
}
