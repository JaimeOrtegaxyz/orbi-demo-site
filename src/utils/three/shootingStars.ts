
import * as THREE from "three";

export interface ShootingStar {
  points: THREE.Points;
  line?: THREE.Line; // Keep for backwards compatibility
  velocity: THREE.Vector3;
  progress: number;
  lifetime: number;
  active: boolean;
  length: number; // Trail length
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
  // Define the number of particles in the trail
  const trailSegments = 20;
  
  // Create buffer geometry for the particles
  const positions = new Float32Array(trailSegments * 3);
  const colors = new Float32Array(trailSegments * 3);
  
  // Initialize all positions to the same point (will be updated later)
  for (let i = 0; i < trailSegments; i++) {
    positions[i * 3] = 0;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;
    
    // Set colors with full transparency initially
    colors[i * 3] = 1; // R
    colors[i * 3 + 1] = 1; // G
    colors[i * 3 + 2] = 1; // B
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Create point material with vertex colors
  const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });
  
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  
  return {
    points,
    velocity: new THREE.Vector3(0, 0, 0),
    progress: 0,
    lifetime: 0,
    active: false,
    length: trailSegments
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
  
  // Calculate overall opacity based on progress (fade in/out of entire object)
  let globalOpacity = 1.0;
  const fadeTime = 0.3 / star.lifetime; // 0.3s fade time normalized to lifetime
  
  if (star.progress < fadeTime) {
    // Fade in
    globalOpacity = star.progress / fadeTime;
  } else if (star.progress > (1 - fadeTime)) {
    // Fade out
    globalOpacity = (1 - star.progress) / fadeTime;
  }
  
  // Update the star trail with gradient effect
  if (star.points.geometry instanceof THREE.BufferGeometry) {
    const positions = star.points.geometry.attributes.position.array as Float32Array;
    const colors = star.points.geometry.attributes.color.array as Float32Array;
    
    // Calculate the current head position
    const currentProgress = Math.min(1, star.progress * 1.5); // 1.5x multiplier makes trail appear faster
    const headPosition = new THREE.Vector3(0, 0, 0);
    
    // Calculate the head position based on the starting point and velocity
    headPosition.x = positions[0] + star.velocity.x * currentProgress;
    headPosition.y = positions[1] + star.velocity.y * currentProgress;
    headPosition.z = positions[2] + star.velocity.z * currentProgress;
    
    // Update all points in the trail
    for (let i = 0; i < star.length; i++) {
      // Calculate position along the trail (0 = head, 1 = tail)
      const trailFactor = i / (star.length - 1);
      
      // Position each segment at appropriate distance from the head
      positions[i * 3] = headPosition.x - (star.velocity.x * currentProgress * trailFactor);
      positions[i * 3 + 1] = headPosition.y - (star.velocity.y * currentProgress * trailFactor);
      positions[i * 3 + 2] = headPosition.z - (star.velocity.z * currentProgress * trailFactor);
      
      // Apply gradient effect - intensity decreases from head to tail (head = 1.0, tail = 0.5)
      const intensity = 1.0 - (trailFactor * 0.5); // 50% reduction at tail
      
      // Apply overall opacity fade to all trail segments
      const finalIntensity = intensity * globalOpacity;
      
      // Update colors with intensity
      colors[i * 3] = finalIntensity;     // R
      colors[i * 3 + 1] = finalIntensity; // G
      colors[i * 3 + 2] = finalIntensity; // B
    }
    
    // Mark attributes for update
    star.points.geometry.attributes.position.needsUpdate = true;
    star.points.geometry.attributes.color.needsUpdate = true;
    
    // Update material opacity for the entire trail
    (star.points.material as THREE.PointsMaterial).opacity = globalOpacity;
  }
  
  // Return false if the star has completed its lifetime
  if (star.progress >= 1.0) {
    star.active = false;
    (star.points.material as THREE.PointsMaterial).opacity = 0;
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
  
  // Set all points to the start position initially
  if (star.points.geometry instanceof THREE.BufferGeometry) {
    const positions = star.points.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < star.length; i++) {
      positions[i * 3] = startPosition.x;
      positions[i * 3 + 1] = startPosition.y;
      positions[i * 3 + 2] = startPosition.z;
    }
    
    star.points.geometry.attributes.position.needsUpdate = true;
  }
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
    return timeSinceLastStar; // Don't increment time while a star is active
  }
  
  // Add to the timer only when no star is active
  timeSinceLastStar += deltaTime;
  
  // Determine if it's time for a new star (30-90 seconds between stars)
  const minInterval = 30;
  const maxInterval = 90;
  
  // Generate a random interval within our range if we haven't already
  if (!star.hasOwnProperty('nextInterval')) {
    (star as any).nextInterval = minInterval + Math.random() * (maxInterval - minInterval);
  }
  
  // Check if we've reached the next interval
  if (timeSinceLastStar >= (star as any).nextInterval) {
    activateShootingStar(star, offsetX, planetRadius);
    
    // Generate the next interval for the next star
    (star as any).nextInterval = minInterval + Math.random() * (maxInterval - minInterval);
    
    return 0; // Reset the timer
  }
  
  return timeSinceLastStar;
};
