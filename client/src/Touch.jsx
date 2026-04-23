import { useEffect } from "react";

function TouchRipple() {
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const handleTouch = (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      const x = touch.clientX;
      const y = touch.clientY;

      const ripple = document.createElement("div");

      ripple.style.position = "fixed";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "14px";
      ripple.style.height = "14px";
      ripple.style.borderRadius = "9999px";
      ripple.style.pointerEvents = "none";
      ripple.style.transform = "translate(-50%, -50%) scale(1)";
      ripple.style.background = "rgba(34,211,238,0.20)";
      ripple.style.opacity = "0.7";
      ripple.style.zIndex = "5";
      ripple.style.transition =
        "transform 280ms ease-out, opacity 320ms ease-out";

      document.body.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(5)";
        ripple.style.opacity = "0";
      });

      setTimeout(() => {
        ripple.remove();
      }, 340);
    };

    window.addEventListener("touchstart", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return null;
}

export default TouchRipple;
