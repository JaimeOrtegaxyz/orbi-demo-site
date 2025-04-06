import { useEffect, useRef } from "react";
import { setupScene, createCore } from "@/utils/three/coreSetup";
import { createRing, createStarField } from "@/utils/three/particleSystem";
import { setupControls, animateRings } from "@/utils/three/animationControls";
import { createShootingStar, updateShootingStar, manageShootingStars, activateShootingStar } from "@/utils/three/shootingStars";
import { useIsMobile, TOUCH_DIRECTION_THRESHOLD } from "@/hooks/use-mobile";

const OrbiVisualization = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // Track touch movement for distinguishing between horizontal/vertical swipes
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalSwipeRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const offsetX = 3.5; // Offset for rightward positioning
    const planetRadius = 1.3; // Same as the core radius
    
    // Setup scene, camera, and renderer
    const { scene, camera, renderer } = setupScene(container, offsetX);
    
    // Add core sphere
    createCore(scene, offsetX);

    // Create rings with same parameters as before
    const rings = [
      createRing(1.8, 0.6, 45000, 0xb27937, offsetX),
      createRing(2.4, 0.3, 30000, 0xb26f5a, offsetX),
      createRing(1.5, 0.2, 22500, 0x96462f, offsetX),
    ];
    
    // Add all rings to scene
    rings.forEach(({ ring }) => scene.add(ring));

    // Add starfield in the background
    const stars = createStarField(2000, 20, scene, offsetX);
    
    // Create shooting star
    const shootingStar = createShootingStar(scene, offsetX, planetRadius);
    
    // Time tracking variables
    let timeSinceLastStar = 0;
    let lastTime = performance.now();
    
    // Setup orbit controls
    const controls = setupControls(camera, renderer.domElement);

    // Define touch event handlers outside of conditional for cleanup function reference
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        isHorizontalSwipeRef.current = null;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
      
      // If we haven't determined direction yet and moved enough to tell
      if (isHorizontalSwipeRef.current === null && 
          (deltaX > TOUCH_DIRECTION_THRESHOLD || deltaY > TOUCH_DIRECTION_THRESHOLD)) {
        
        // If horizontal movement dominates, capture the event for rotation
        if (deltaX > deltaY) {
          isHorizontalSwipeRef.current = true;
          renderer.domElement.style.pointerEvents = 'auto';
          e.preventDefault();
        } else {
          // Vertical movement dominates, let the browser handle scrolling
          isHorizontalSwipeRef.current = false;
          renderer.domElement.style.pointerEvents = 'none';
        }
      }
      
      // If already determined to be a horizontal swipe, keep capturing
      if (isHorizontalSwipeRef.current === true) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = () => {
      touchStartRef.current = null;
      isHorizontalSwipeRef.current = null;
      renderer.domElement.style.pointerEvents = 'auto';
    };

    // On mobile, we need to handle touch events to determine if we should allow scrolling
    if (isMobile) {
      // Make the canvas receive pointer events only for horizontal movements
      renderer.domElement.style.pointerEvents = 'auto';
      
      // Add touch event listeners
      renderer.domElement.addEventListener('touchstart', handleTouchStart);
      renderer.domElement.addEventListener('touchmove', handleTouchMove);
      renderer.domElement.addEventListener('touchend', handleTouchEnd);
    }

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

      // Animate rings
      animateRings(rings);
      
      // Manage shooting stars
      timeSinceLastStar = manageShootingStars(
        shootingStar, 
        deltaTime, 
        timeSinceLastStar, 
        offsetX, 
        planetRadius
      );
      
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
      
      // Remove touch event listeners if on mobile
      if (isMobile && renderer.domElement) {
        renderer.domElement.removeEventListener('touchstart', handleTouchStart);
        renderer.domElement.removeEventListener('touchmove', handleTouchMove);
        renderer.domElement.removeEventListener('touchend', handleTouchEnd);
      }
      
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.clear();
      renderer.dispose();
    };
  }, [isMobile]);

  return <div ref={containerRef} className="w-full h-full visualization-fade-in" />;
};

export default OrbiVisualization;
