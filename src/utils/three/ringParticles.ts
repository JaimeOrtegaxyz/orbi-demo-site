
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
        float intensity = max(0.3, dot(vNormal, lightDir));
        
        // Modified shadow calculation to reduce darkness
        vec3 toCoreDir = normalize(-vPosition);
        vec3 toLightDir = normalize(lightPosition);
        float shadowFactor = dot(toCoreDir, toLightDir);
        if (length(vPosition) > 1.0 && shadowFactor > 0.8) {
          intensity *= 0.6; // Reduced shadowing effect from 0.3 to 0.6
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

  // Calculate initial rotation values based on the 3.5 minute mark (210 seconds)
  // For the first ring: 210 seconds * 0.0005 rotation/second = 0.105 radians
  // For the second ring: 210 seconds * -0.0004 rotation/second = -0.084 radians
  // For the third ring: 210 seconds * 0.0006 * 0.3 rotation/second = 0.0378 radians
  if (radius === 1.8) { // Main ring (first ring)
    ring.rotation.y = 0.105; // 210 seconds * 0.0005
    // Added a phase offset to give a more distinct visual difference
    ring.rotation.x = Math.sin(Date.now() * 0.00005 + 210000 * 0.00005) * 0.12;
  } else if (radius === 2.4) { // Second ring
    ring.rotation.y = -0.084; // 210 seconds * -0.0004
    ring.rotation.x = Math.sin(Date.now() * 0.00006 + 210000 * 0.00006) * 0.07;
  } else if (radius === 1.5) { // Third ring
    ring.rotation.y = 0.0378; // 210 seconds * 0.0006 * 0.3
    // Add a slight x rotation to the third ring for more visual interest
    ring.rotation.x = 0.02;
  }

  return {
    ring,
    rotation: {
      x: 0,
      y: 0,
    },
  };
};
