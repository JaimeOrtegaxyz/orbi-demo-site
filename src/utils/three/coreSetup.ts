
import * as THREE from "three";

export interface SceneSetup {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export const setupScene = (
  container: HTMLElement,
  offsetX: number = 1.5
): SceneSetup => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = null; // Transparent background to overlay on hero section

  // Camera setup - zoomed in view
  const camera = new THREE.PerspectiveCamera(
    50, // Narrower field of view for more zoom
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(2.5, 1, 2.5); // Closer position to the core

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Add lighting
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  return { scene, camera, renderer };
};

export const createCore = (scene: THREE.Scene, offsetX: number = 1.5): THREE.Mesh => {
  // Core sphere (representing data core)
  const coreGeometry = new THREE.SphereGeometry(1, 32, 32);
  const coreMaterial = new THREE.MeshStandardMaterial({
    color: 0xff4500, // Orbi's red
    roughness: 0.7,
    metalness: 0.3,
    emissive: 0xff4500,
    emissiveIntensity: 0.2,
  });
  
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  core.position.x = offsetX; // Position offset
  scene.add(core);
  
  return core;
};
