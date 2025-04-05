
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
  
  // Load the texture for the planet
  const textureLoader = new THREE.TextureLoader();
  const planetTexture = textureLoader.load('/lovable-uploads/45d78b1f-6e8b-4a62-8fda-a053a358022e.png');
  
  // Create material with the texture
  const coreMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
    roughness: 0.7,
    metalness: 0.3,
    emissive: 0x2f0c00,
    emissiveIntensity: 0.05,
  });
  
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.x = offsetX;
  
  // Make the core cast and receive shadows
  core.castShadow = true;
  core.receiveShadow = true;
  
  scene.add(core);
  
  return core;
};
