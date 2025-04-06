
import { useEffect, useRef } from "react";
import { setupScene, createCore } from "@/utils/three/coreSetup";
import { createRing, createStarField } from "@/utils/three/particleSystem";
import { setupControls, animateRings } from "@/utils/three/animationControls";
import { createShootingStar, updateShootingStar, manageShootingStars, activateShootingStar } from "@/utils/three/shootingStars";

const OrbiVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const offsetX = 3.5; // Offset for rightward positioning
    const planetRadius = 1.3; // Same as the core radius
    
    // Setup scene, camera, and renderer
    const { scene, camera, renderer } = setupScene(container, offsetX);
    
    // Add core sphere
    createCore(scene, offsetX);

    // Create particle rings with desaturated Orbi color palette (45% desaturation - 60% original + 15% saturation added back)
    // Triple the particle count for higher density
    const rings = [
      createRing(1.8, 0.6, 45000, 0xb27937, offsetX), // Main red ring (desaturated then re-saturated by 15%)
      createRing(2.4, 0.3, 30000, 0xb26f5a, offsetX), // Lighter red ring (desaturated then re-saturated by 15%)
      createRing(1.5, 0.2, 22500, 0x96462f, offsetX),  // Darker red ring (desaturated then re-saturated by 15%)
    ];
    
    // Add all rings to scene
    rings.forEach(({ ring }) => scene.add(ring));

    // Add starfield in the background (scaled down in the createStarField function)
    const stars = createStarField(2000, 20, scene, offsetX);
    
    // Create shooting star
    const shootingStar = createShootingStar(scene, offsetX, planetRadius);
    
    // Time tracking variables
    let timeSinceLastStar = 0;
    let lastTime = performance.now();
    
    // In development mode, show shooting stars more frequently for testing
    const isDevMode = process.env.NODE_ENV === 'development';

    // Setup orbit controls - enable rotation on entire canvas area
    const controls = setupControls(camera, renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      const currentTime = performance.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      requestAnimationFrame(animate);

      // Animate rings with 85% slower speed
      animateRings(rings);
      
      // Manage shooting stars - use shortened intervals in dev mode
      if (isDevMode) {
        // In dev mode, create shooting stars every 5-10 seconds for easier testing
        if (!shootingStar.active && timeSinceLastStar > 5 + Math.random() * 5) {
          activateShootingStar(shootingStar, offsetX, planetRadius);
          timeSinceLastStar = 0;
        } else if (shootingStar.active) {
          updateShootingStar(shootingStar, deltaTime);
        } else {
          timeSinceLastStar += deltaTime;
        }
      } else {
        // Normal mode - 30-90 seconds between stars
        timeSinceLastStar = manageShootingStars(
          shootingStar, 
          deltaTime, 
          timeSinceLastStar, 
          offsetX, 
          planetRadius
        );
      }
      
      // Update controls
      controls.update();
      
      // Render scene
      renderer.render(scene, camera);
    };

    // Start animation
    animate();

    // Cleanup function
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

  return <div ref={containerRef} className="w-full h-full visualization-fade-in" />;
};

export default OrbiVisualization;
