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
  particleCount: number, // Note: particleCount will be tripled by the OrbiVisualization component
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
    
    opacities.push(0.8 - Math.random() * 0.3);
    // Decrease particle size by 2/3 (multiply by 1/3)
    sizes.push((0.05 + Math.random() * 0.05) * (1/3));
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

  const particleMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      color: { value: new THREE.Color(color) },
      lightPosition: { value: new THREE.Vector3(100, 20, 50) }
    },
    vertexShader: `
      attribute float opacity;
      attribute float size;
      varying float vOpacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      void main() {
        vPosition = position;
        vNormal = normalize(position);
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
        vec3 lightDir = normalize(lightPosition - vPosition);
        float intensity = max(0.1, dot(vNormal, lightDir));
        
        vec3 toCoreDir = normalize(-vPosition);
        vec3 toLightDir = normalize(lightPosition);
        float shadowFactor = dot(toCoreDir, toLightDir);
        if (length(vPosition) > 1.0 && shadowFactor > 0.8) {
          intensity *= 0.3;
        }
        
        gl_FragColor = vec4(color * intensity, vOpacity);
        
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float depthFactor = clamp(1.0 - depth/20.0, 0.5, 1.0);
        gl_FragColor.rgb *= depthFactor;
      }
    `
  });

  const ring = new THREE.Points(particles, particleMaterial);
  ring.position.x = offsetX;

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

/**
 * Creates a starfield of distant particles
 * @param count Number of stars
 * @param radius Radius of the star field sphere
 * @param scene The THREE.Scene to add stars to
 * @param offsetX X-axis offset for positioning
 * @returns The star field points object
 */
export const createStarField = (
  count: number,
  radius: number,
  scene: THREE.Scene,
  offsetX: number = 3.5
): THREE.Points => {
  const starsGeometry = new THREE.BufferGeometry();
  const positions: number[] = [];

  // Scale down the radius to 1/5 of its original size
  const scaledRadius = radius * 0.2;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = scaledRadius * Math.cbrt(Math.random());
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    positions.push(x + offsetX, y, z);
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const starsMaterial = new THREE.PointsMaterial({
    color: 0x5a5a5a, // Increased brightness from 0x3a3a3a (about 50% brighter)
    size: 0.0035,
    transparent: true,
    opacity: 1.0, // Increased from 0.8 for more visibility
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  return stars;
};

