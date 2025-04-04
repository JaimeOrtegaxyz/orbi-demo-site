
import { useEffect, useRef } from "react";
import { setupScene, createCore } from "@/utils/three/coreSetup";
import { createRing, createStarField } from "@/utils/three/particleSystem";
import { setupControls, animateRings } from "@/utils/three/animationControls";

const OrbiVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const offsetX = 3.5; // Offset for rightward positioning
    
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
      requestAnimationFrame(animate);

      // Animate rings with 85% slower speed
      animateRings(rings);
      
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

  return <div ref={containerRef} className="w-full h-full" />;
};

export default OrbiVisualization;
