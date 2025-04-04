
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
  const opacities: number[] = [];
  const sizes: number[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = radius + (Math.random() - 0.5) * thickness;
    const x = Math.cos(angle) * r;
    const y = (Math.random() - 0.5) * thickness * 0.5;
    const z = Math.sin(angle) * r;
    positions.push(x, y, z);
    
    // Add opacity and size attributes for the shader
    opacities.push(0.8 - Math.random() * 0.3); // Random opacity between 0.5-0.8
    sizes.push(0.05 + Math.random() * 0.05); // Random size between 0.05-0.1
  }

  particles.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  particles.setAttribute(
    "opacity",
    new THREE.Float32BufferAttribute(opacities, 1)
  );
  particles.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes, 1)
  );

  // Change 4: Update shader to handle the directional light and shadows
  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      color: { value: new THREE.Color(color) },
      lightPosition: { value: new THREE.Vector3(100, 20, 50) } // Match sunLight position
    },
    vertexShader: `
      attribute float opacity;
      attribute float size;
      varying float vOpacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vPosition = position;
        vNormal = normalize(position); // Use position as normal for sphere-like shading
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
      varying vec3 vNormal;
      void main() {
        // Calculate lighting based on position relative to light
        vec3 lightDir = normalize(lightPosition - vPosition);
        float intensity = max(0.1, dot(vNormal, lightDir));
        
        // Apply shadows - particles behind the core relative to light
        vec3 toCoreDir = normalize(-vPosition);
        vec3 toLightDir = normalize(lightPosition);
        float shadowFactor = dot(toCoreDir, toLightDir);
        // Create shadow when particle is behind the core relative to light
        if (length(vPosition) > 1.0 && shadowFactor > 0.8) {
          intensity *= 0.3; // Darken when in shadow
        }
        
        gl_FragColor = vec4(color * intensity, vOpacity);
        
        // Apply depth-based darkening for realism
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float depthFactor = clamp(1.0 - depth/20.0, 0.5, 1.0);
        gl_FragColor.rgb *= depthFactor;
      }
    `
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
    const opacities = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

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
      
      // Add opacity and size attributes
      opacities[j] = 0.6 - (t * 0.2); // Fade as particles approach the core
      sizes[j] = 0.08 + ((1-t) * 0.05); // Larger further from core
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

    // Use similar shader material for stream particles
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
