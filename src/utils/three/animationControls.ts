
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Ring, StreamParticle } from "./particleSystem";

export const setupControls = (
  camera: THREE.PerspectiveCamera,
  domElement: HTMLCanvasElement
): OrbitControls => {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false; // Disable zoom
  controls.enablePan = false; // Disable panning
  controls.rotateSpeed = 0.5; // Adjust rotation speed
  controls.enabled = true; // Enable interactive controls
  
  // Fix to make controls work when clicking on any object
  controls.addEventListener('start', function() {
    // Set pointer events to none for all objects during drag to allow raycast through them
    domElement.style.pointerEvents = 'auto';
  });

  controls.addEventListener('end', function() {
    // Reset pointer events after drag
    domElement.style.pointerEvents = 'auto';
  });
  
  return controls;
};

export const animateRings = (rings: Ring[]): void => {
  rings[0].ring.rotation.y += 0.001;
  rings[1].ring.rotation.y -= 0.0008;
  
  // Change 5: Slow down the innermost ring by 70%
  rings[2].ring.rotation.y += 0.0012 * 0.3; // Reduced by 70%

  rings[0].ring.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
  rings[1].ring.rotation.x = Math.sin(Date.now() * 0.00012) * 0.05;
};

export const animateStreamParticles = (
  streamParticles: StreamParticle[],
  offsetX: number = 3.5
): void => {
  streamParticles.forEach((stream) => {
    const positions = stream.points.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < positions.length; i += 3) {
      // Move particles along their path
      const x = positions[i] - offsetX; // Adjust for offset
      const z = positions[i + 2];
      const dist = Math.sqrt(x * x + z * z);

      if (dist < 0.2) {
        // Reset particle to outside when it reaches the core
        const angle = Math.atan2(z, x);
        positions[i] = Math.cos(angle) * 8 + offsetX; // Add offset back
        positions[i + 2] = Math.sin(angle) * 8;
        positions[i + 1] = 0;
      } else {
        // Move particle toward center
        const dir = -stream.velocity / dist;
        positions[i] += x * dir;
        positions[i + 2] += z * dir;
      }
    }
    stream.points.geometry.attributes.position.needsUpdate = true;
  });
};
