
import * as THREE from "three";

export interface ShootingStar {
  line: THREE.Line;
  velocity: THREE.Vector3;
  progress: number;
  lifetime: number;
  active: boolean;
}

/**
 * Creates a shooting star effect
 * @param scene The THREE.Scene to add the shooting star to
 * @param offsetX X-axis offset for positioning
 * @param planetRadius Radius of the planet to avoid
 * @returns The shooting star object
 */
export const createShootingStar = (
  scene: THREE.Scene,
  offsetX: number = 3.5,
  planetRadius: number = 1.3
): ShootingStar => {
  // Define shooting star material
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    linewidth: 1
  });

  // Create line geometry - will be positioned later when activated
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0)
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  return {
    line,
    velocity: new THREE.Vector3(0, 0, 0),
    progress: 0,
    lifetime: 0,
    active: false
  };
};

/**
 * Updates the shooting star state
 * @param star Shooting star object to update
 * @param deltaTime Time since last frame in seconds
 * @returns True if the star is still active
 */
export const updateShootingStar = (star: ShootingStar, deltaTime: number): boolean => {
  if (!star.active) return false;

  star.progress += deltaTime / star.lifetime;
  
  // Calculate opacity based on progress (fade in/out)
  let opacity = 1.0;
  const fadeTime = 0.3 / star.lifetime; // 0.3s fade time normalized to lifetime
  
  if (star.progress < fadeTime) {
    // Fade in
    opacity = star.progress / fadeTime;
  } else if (star.progress > (1 - fadeTime)) {
    // Fade out
    opacity = (1 - star.progress) / fadeTime;
  }
  
  // Update opacity
  (star.line.material as THREE.LineBasicMaterial).opacity = opacity;
  
  // Update position
  const points = star.line.geometry.attributes.position.array as Float32Array;
  const startPoint = new THREE.Vector3(points[0], points[1], points[2]);
  const endPoint = startPoint.clone().add(
    star.velocity.clone().multiplyScalar(star.progress)
  );
  
  // Update end point
  points[3] = endPoint.x;
  points[4] = endPoint.y;
  points[5] = endPoint.z;
  star.line.geometry.attributes.position.needsUpdate = true;
  
  // Return false if the star has completed its lifetime
  if (star.progress >= 1.0) {
    star.active = false;
    (star.line.material as THREE.LineBasicMaterial).opacity = 0;
    return false;
  }
  
  return true;
};

/**
 * Activates a shooting star with random position and direction
 * @param star Shooting star object to activate
 * @param offsetX X-axis offset for positioning
 * @param planetRadius Radius of the planet to avoid
 * @param maxDistance Maximum distance from center for the star path
 */
export const activateShootingStar = (
  star: ShootingStar,
  offsetX: number = 3.5,
  planetRadius: number = 1.3,
  maxDistance: number = 5
): void => {
  // Reset progress
  star.progress = 0;
  star.active = true;
  star.lifetime = 1.0 + Math.random() * 1.0; // 1-2 seconds lifetime
  
  // Create a random direction for the shooting star
  const direction = new THREE.Vector3(
    Math.random() * 2 - 1,
    Math.random() * 2 - 1,
    Math.random() * 2 - 1
  ).normalize();
  
  // Determine start position - at least planetRadius*2 away from planet center
  const minDistance = planetRadius * 2;
  const distance = minDistance + Math.random() * (maxDistance - minDistance);
  
  // Planet center
  const planetCenter = new THREE.Vector3(offsetX, 0, 0);
  
  // Generate a random start position outside the minimum distance
  const phi = Math.random() * Math.PI * 2;
  const theta = Math.acos(2 * Math.random() - 1);
  const startPosition = new THREE.Vector3(
    distance * Math.sin(theta) * Math.cos(phi) + offsetX,
    distance * Math.sin(theta) * Math.sin(phi),
    distance * Math.cos(theta)
  );
  
  // Check if the line would intersect the planet and adjust if needed
  let validPath = false;
  let attempts = 0;
  let adjustedDirection = direction.clone();
  
  while (!validPath && attempts < 10) {
    // Calculate the closest distance from the ray to the planet center
    const rayDirection = adjustedDirection.clone().normalize();
    const rayOrigin = startPosition.clone();
    const toOrigin = rayOrigin.clone().sub(planetCenter);
    
    // Project toOrigin onto rayDirection
    const projection = toOrigin.dot(rayDirection);
    const closestPoint = rayOrigin.clone().sub(rayDirection.clone().multiplyScalar(projection));
    
    // Calculate closest distance to planet center
    const closestDistance = planetCenter.distanceTo(closestPoint);
    
    if (closestDistance > planetRadius) {
      validPath = true;
    } else {
      // Adjust the direction slightly
      adjustedDirection = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      attempts++;
    }
  }
  
  // If we couldn't find a valid path after attempts, just use a path away from the planet
  if (!validPath) {
    adjustedDirection = startPosition.clone().sub(planetCenter).normalize();
  }
  
  // Create end position - the velocity is the direction * a random speed * the lifetime
  const speed = 2 + Math.random() * 3; // Units per second
  star.velocity = adjustedDirection.multiplyScalar(speed * star.lifetime);
  
  // Set the start position
  const points = star.line.geometry.attributes.position.array as Float32Array;
  points[0] = startPosition.x;
  points[1] = startPosition.y;
  points[2] = startPosition.z;
  points[3] = startPosition.x;
  points[4] = startPosition.y;
  points[5] = startPosition.z;
  star.line.geometry.attributes.position.needsUpdate = true;
};

/**
 * Manages shooting stars, activating them at random intervals
 * @param star The shooting star object
 * @param deltaTime Time since last frame in seconds
 * @param timeSinceLastStar Time since the last star was activated
 * @param offsetX X-axis offset for positioning
 * @param planetRadius Radius of the planet to avoid
 * @returns Updated time since last star
 */
export const manageShootingStars = (
  star: ShootingStar,
  deltaTime: number,
  timeSinceLastStar: number,
  offsetX: number = 3.5,
  planetRadius: number = 1.3
): number => {
  // Update existing star if active
  if (star.active) {
    updateShootingStar(star, deltaTime);
    return timeSinceLastStar + deltaTime;
  }
  
  // Add to the timer
  timeSinceLastStar += deltaTime;
  
  // Determine if it's time for a new star (30-90 seconds between stars)
  const minInterval = 30;
  const maxInterval = 90;
  const interval = minInterval + Math.random() * (maxInterval - minInterval);
  
  if (timeSinceLastStar >= interval) {
    activateShootingStar(star, offsetX, planetRadius);
    return 0; // Reset the timer
  }
  
  return timeSinceLastStar;
};
