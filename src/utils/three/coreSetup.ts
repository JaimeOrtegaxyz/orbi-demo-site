
import * as THREE from "three";

export interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export const setupScene = (
  container: HTMLElement,
  offsetX: number = 3.5, // Offset is now dynamic based on device
  isMobile: boolean = false
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
  
  // Adjust camera position based on device
  if (isMobile) {
    // For mobile, move camera to show more of the planet
    camera.position.set(3, 1, 4.5);
  } else {
    // Original position for desktop
    camera.position.set(4, 1, 4);
  }

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
  
  // Create material with initial properties
  const coreMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.7,
    metalness: 0.3,
    emissive: 0x2f0c00,
    emissiveIntensity: 0.05,
    color: 0xFFFFFF, // Set a base color so it's not just black before texture loads
  });
  
  // Create the core mesh
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.x = offsetX;
  
  // Make the core cast and receive shadows
  core.castShadow = true;
  core.receiveShadow = true;
  
  // Add to scene immediately
  scene.add(core);
  
  // Use the currently uploaded image from user
  const textureUrl = '/lovable-uploads/92e52ce3-44b1-478b-9073-88d13ea7bf8a.png';
  console.log("Loading texture from:", textureUrl);
  
  // Load texture and apply it after loading
  new THREE.TextureLoader().load(
    textureUrl,
    (texture) => {
      console.log('Planet texture loaded successfully');
      texture.colorSpace = THREE.SRGBColorSpace;
      coreMaterial.map = texture;
      coreMaterial.needsUpdate = true;
    },
    (xhr) => {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    (error) => {
      console.error('Error loading planet texture:', error);
    }
  );
  
  return core;
};
