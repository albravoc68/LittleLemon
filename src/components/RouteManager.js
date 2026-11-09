import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Handles scrolling and keyboard focus after client-side navigation, which the browser does not do on its own.
function RouteManager() {
  const { pathname, hash } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      target.scrollIntoView();
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
      // Moving focus to the main region announces the new page to screen reader users.
      if (!isFirstRender.current) {
        document.getElementById("main-content")?.focus({ preventScroll: true });
      }
    }
    isFirstRender.current = false;
  }, [pathname, hash]);

  return null;
}

export default RouteManager;
