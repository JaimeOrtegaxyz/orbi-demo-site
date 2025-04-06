
import * as THREE from "three";

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
    const opacities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    const angle = (i / count) * Math.PI * 2;
    const startX = Math.cos(angle) * 8;
    const startZ = Math.sin(angle) * 8;

    for (let j = 0; j < particleCount; j++) {
      const t = j / particleCount;
      const x = startX * (1 - t);
      const y = Math.sin(t * Math.PI) * 0.5;
      const z = startZ * (1 - t);

      positions[j * 3] = x + offsetX;
      positions[j * 3 + 1] = y;
      positions[j * 3 + 2] = z;
      
      opacities[j] = 0.6 - (t * 0.2);
      sizes[j] = 0.08 + ((1-t) * 0.05);
    }

    streamGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    streamGeometry.setAttribute(
      "opacity",
      new THREE.BufferAttribute(opacities, 1)
    );
    streamGeometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new THREE.Color(0xff4500) },
        lightPosition: { value: new THREE.Vector3(100, 20, 50) }
      },
      vertexShader: `
        attribute float opacity;
        attribute float size;
        varying float vOpacity;
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          vOpacity = opacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 lightPosition;
        varying float vOpacity;
        varying vec3 vPosition;
        void main() {
          vec3 lightDir = normalize(lightPosition - vPosition);
          float intensity = 0.6 + 0.4 * dot(normalize(vPosition), lightDir);
          gl_FragColor = vec4(color * intensity, vOpacity);
        }
      `
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
