
import { useEffect, useRef } from "react";
import { setupScene, createCore } from "@/utils/three/coreSetup";
import { createRing, createDataStreams } from "@/utils/three/particleSystem";
import { setupControls, animateRings, animateStreamParticles } from "@/utils/three/animationControls";

const OrbiVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const offsetX = 1.5; // Common offset value
    
    // Setup scene, camera, and renderer
    const { scene, camera, renderer } = setupScene(container, offsetX);
    
    // Add core sphere
    createCore(scene, offsetX);

    // Create particle rings with Orbi color palette
    const rings = [
      createRing(1.8, 0.6, 15000, 0xff4500, offsetX), // Main red ring
      createRing(2.4, 0.3, 10000, 0xff6347, offsetX), // Lighter red ring
      createRing(1.5, 0.2, 7500, 0xd03e15, offsetX),  // Darker red ring
    ];
    
    // Add all rings to scene
    rings.forEach(({ ring }) => scene.add(ring));

    // Create data streams
    const streamParticles = createDataStreams(scene, 5, offsetX);

    // Setup orbit controls
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

      // Animate rings
      animateRings(rings);
      
      // Animate stream particles
      animateStreamParticles(streamParticles, offsetX);

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
