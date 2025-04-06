
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
  
  // Planet radius (same as core radius in createCore)
  const planetRadius = 1.3;
  // Exclusion zone is 3x the planet radius
  const exclusionZoneRadius = planetRadius * 3;

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = scaledRadius * Math.cbrt(Math.random());
    
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    // Calculate distance from the planet center (positioned at offsetX)
    const distanceFromPlanet = Math.sqrt(
      Math.pow(x, 2) + 
      Math.pow(y, 2) + 
      Math.pow(z, 2)
    );
    
    // Only add stars that are outside the exclusion zone
    if (distanceFromPlanet > exclusionZoneRadius) {
      positions.push(x + offsetX, y, z);
    }
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
