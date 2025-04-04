
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const OrbiVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A0A); // Match our dark background

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 2, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

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
    scene.add(core);

    // Particle rings (data flow visualization)
    const createRing = (radius: number, thickness: number, particleCount: number, color: number) => {
      const particles = new THREE.BufferGeometry();
      const positions: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = radius + (Math.random() - 0.5) * thickness;
        const x = Math.cos(angle) * r;
        const y = (Math.random() - 0.5) * thickness * 0.5;
        const z = Math.sin(angle) * r;
        positions.push(x, y, z);
      }

      particles.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );

      const particleMaterial = new THREE.PointsMaterial({
        color: color,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
      });

      const ring = new THREE.Points(particles, particleMaterial);
      return ring;
    };

    // Create multiple rings with Orbi color palette
    const ring1 = createRing(1.8, 0.6, 15000, 0xff4500); // Main red ring
    const ring2 = createRing(2.4, 0.3, 10000, 0xff6347); // Lighter red ring
    const ring3 = createRing(1.5, 0.2, 7500, 0xd03e15); // Darker red ring

    scene.add(ring1, ring2, ring3);

    // Add data streams (small particles flowing toward the core)
    const streamCount = 5;
    const streamParticles: { points: THREE.Points; velocity: number }[] = [];

    for (let i = 0; i < streamCount; i++) {
      const streamGeometry = new THREE.BufferGeometry();
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);

      // Create a curved path from outside toward the core
      const angle = (i / streamCount) * Math.PI * 2;
      const startX = Math.cos(angle) * 8;
      const startZ = Math.sin(angle) * 8;

      for (let j = 0; j < particleCount; j++) {
        const t = j / particleCount;
        const x = startX * (1 - t);
        const y = Math.sin(t * Math.PI) * 0.5;
        const z = startZ * (1 - t);

        positions[j * 3] = x;
        positions[j * 3 + 1] = y;
        positions[j * 3 + 2] = z;
      }

      streamGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const material = new THREE.PointsMaterial({
        color: 0xff4500,
        size: 0.08,
        transparent: true,
        opacity: 0.6,
      });

      const stream = new THREE.Points(streamGeometry, material);
      scene.add(stream);
      streamParticles.push({
        points: stream,
        velocity: 0.005 + Math.random() * 0.005,
      });
    }

    // Controls for testing - set to disabled for final implementation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false; // Disable interactive controls

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Slowly rotate the rings
      ring1.rotation.y += 0.001;
      ring2.rotation.y -= 0.0008;
      ring3.rotation.y += 0.0012;

      ring1.rotation.x = Math.sin(Date.now() * 0.0001) * 0.1;
      ring2.rotation.x = Math.sin(Date.now() * 0.00012) * 0.05;

      // Animate stream particles flowing toward core
      streamParticles.forEach((stream) => {
        const positions = stream.points.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          // Move particles along their path
          const x = positions[i];
          const z = positions[i + 2];
          const dist = Math.sqrt(x * x + z * z);

          if (dist < 0.2) {
            // Reset particle to outside when it reaches the core
            const angle = Math.atan2(z, x);
            positions[i] = Math.cos(angle) * 8;
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

      controls.update();
      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default OrbiVisualization;
