
import * as THREE from "three";

export interface Ring {
  ring: THREE.Points;
  rotation: {
    x: number;
    y: number;
  };
}

export const createRing = (
  radius: number,
  thickness: number,
  particleCount: number,
  color: number,
  offsetX: number = 3.5
): Ring => {
  const particles = new THREE.BufferGeometry();
  const positions: number[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * thickness;
    const x = Math.cos(angle) * r;
    const y = (Math.random() - 0.5) * thickness * 0.5;
    const z = Math.sin(angle) * r;
    positions.push(x, y, z);
  }

  particles.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: color,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
  });

  const ring = new THREE.Points(particles, particleMaterial);
  ring.position.x = offsetX; // Apply position offset

  return {
    ring,
    rotation: {
      x: 0,
      y: 0,
    },
  };
};

export interface StreamParticle {
  points: THREE.Points;
  velocity: number;
}

export const createDataStreams = (
  scene: THREE.Scene,
  count: number,
  offsetX: number = 3.5
): StreamParticle[] => {
  const streamParticles: StreamParticle[] = [];

  for (let i = 0; i < count; i++) {
    const streamGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);

    // Create a curved path from outside toward the core
    const angle = (i / count) * Math.PI * 2;
    const startX = Math.cos(angle) * 8;
    const startZ = Math.sin(angle) * 8;

    for (let j = 0; j < particleCount; j++) {
      const t = j / particleCount;
      const x = startX * (1 - t);
      const y = Math.sin(t * Math.PI) * 0.5;
      const z = startZ * (1 - t);

      positions[j * 3] = x + offsetX; // Apply offset
      positions[j * 3 + 1] = y;
      positions[j * 3 + 2] = z;
    }

    streamGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xff4500,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });

    const stream = new THREE.Points(streamGeometry, material);
    scene.add(stream);
    
    streamParticles.push({
      points: stream,
      velocity: 0.005 + Math.random() * 0.005,
    });
  }

  return streamParticles;
};
