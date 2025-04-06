
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial state immediately to avoid flicker
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  return isMobile
}

// Threshold to distinguish between horizontal and vertical swipes (in pixels)
export const TOUCH_DIRECTION_THRESHOLD = 10
