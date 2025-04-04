
import * as THREE from "three";

export interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export const setupScene = (
  container: HTMLElement,
  offsetX: number = 3.5  // Increased offset by about 25% of typical viewport width
): SceneSetup => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = null; // Transparent background to overlay on hero section

  // Camera setup - zoomed in view
  const camera = new THREE.PerspectiveCamera(
    45, // Narrower field of view for more zoom
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(4, 1, 4); // Even closer position to the core for more zoom

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // Enable shadows
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  container.appendChild(renderer.domElement);

  // Make scene darker 
  const ambientLight = new THREE.AmbientLight(0x1F1F1F);
  scene.add(ambientLight);

  // Add a single distant sun-like light source
  const sunLight = new THREE.DirectionalLight(0xFFFFDD, 1.2);
  sunLight.position.set(100, 20, 50);
  scene.add(sunLight);
  
  // Setup shadows for sunlight
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.far = 200;

  // Add subtle environmental hemisphere light
  const hemiLight = new THREE.HemisphereLight(0x444444, 0x111122, 0.2);
  scene.add(hemiLight);

  return { scene, camera, renderer };
};

export const createCore = (scene: THREE.Scene, offsetX: number = 3.5): THREE.Mesh => {
  // Core sphere (representing data core)
  const coreGeometry = new THREE.SphereGeometry(1.3, 32, 32);
  
  // Make the sphere darker but 15% more saturated (70% darker instead of 85%)
  const darkerColor = 0x2f0c00; // Slightly more saturated than before (15% saturation added back)
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: darkerColor,
    roughness: 0.7,
    metalness: 0.3,
    emissive: darkerColor, 
    emissiveIntensity: 0.05, // Reduced emissive intensity by 85%
  });
  
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.x = offsetX;
  
  // Make the core cast and receive shadows
  core.castShadow = true;
  core.receiveShadow = true;
  
  scene.add(core);
  
  return core;
};
