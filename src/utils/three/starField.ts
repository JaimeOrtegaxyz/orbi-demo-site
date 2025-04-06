
import * as THREE from "three";

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
  const scaledRadius = radius * 0.26;

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
    color: 0x7a7a7a, // Further increased brightness from 0x5a5a5a to 0x7a7a7a
    size: 0.004, // Slightly larger star size
    transparent: true,
    opacity: 1.0,
    sizeAttenuation: true
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  return stars;
};
