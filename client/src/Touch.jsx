import { useEffect } from "react";

function TouchRipple() {
  useEffect(() => {
    if (window.innerWidth >= 768) return; // Disable in Desktop

    const handleTouch = (e) => {
      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      const ripple = document.createElement("div");

      ripple.style.position = "fixed";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.borderRadius = "9999px";
      ripple.style.pointerEvents = "none";
      ripple.style.transform = "translate(-50%, -50%) scale(1)";
      ripple.style.background = `
        radial-gradient(circle,
          rgba(34,211,238,0.4) 0%,
          transparent 70%
        )
      `;
      ripple.style.filter = "blur(8px)";
      ripple.style.opacity = "0.8";
      ripple.style.zIndex = "5";
      ripple.style.transition = "transform 0.4s ease, opacity 0.5s ease";

      document.body.appendChild(ripple);

      requestAnimationFrame(() => {
        ripple.style.transform = "translate(-50%, -50%) scale(6)";
        ripple.style.opacity = "0";
      });

      setTimeout(() => {
        ripple.remove();
      }, 500);
    };

    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return null;
}

export default TouchRipple;
