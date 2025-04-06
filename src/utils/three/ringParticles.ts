
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
    
    // Increase base opacity range from (0.5-0.8) to (0.7-1.0) for better visibility
    opacities.push(0.7 + Math.random() * 0.3);
    // Slightly increase particle size for better visibility
    sizes.push((0.06 + Math.random() * 0.06) * (1/3));
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
        // Increase base intensity from 0.3 to 0.5 for better visibility in dark areas
        float intensity = max(0.5, dot(vNormal, lightDir));
        
        // Further reduce shadowing effect
        vec3 toCoreDir = normalize(-vPosition);
        vec3 toLightDir = normalize(lightPosition);
        float shadowFactor = dot(toCoreDir, toLightDir);
        if (length(vPosition) > 1.0 && shadowFactor > 0.8) {
          intensity *= 0.75; // Reduced shadowing effect from 0.6 to 0.75 (less darkness)
        }
        
        // Increase the overall brightness by applying a multiplier
        vec3 brightColor = color * intensity * 1.35; // 35% brightness boost
        
        gl_FragColor = vec4(brightColor, vOpacity);
        
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        // Improve depth visibility for distant particles
        float depthFactor = clamp(1.0 - depth/25.0, 0.65, 1.0); // Adjusted from 0.5 to 0.65 minimum
        gl_FragColor.rgb *= depthFactor;
      }
    `
  });

  const ring = new THREE.Points(particles, particleMaterial);
  ring.position.x = offsetX;

  // Use the current rotation values which were working well
  if (radius === 1.8) { // Main ring (first ring)
    ring.rotation.y = 0.105; 
    ring.rotation.x = Math.sin(Date.now() * 0.00005 + 210000 * 0.00005) * 0.12;
  } else if (radius === 2.4) { // Second ring
    ring.rotation.y = -0.084;
    ring.rotation.x = Math.sin(Date.now() * 0.00006 + 210000 * 0.00006) * 0.07;
  } else if (radius === 1.5) { // Third ring
    ring.rotation.y = 0.0378;
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
