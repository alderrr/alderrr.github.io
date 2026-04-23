import { useEffect, useRef } from "react";

function CursorLight() {
  const ballRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: mouse.x, y: mouse.y };
    let velocity = { x: 0, y: 0 };

    let magneticTarget = null;
    let animationId = null;

    const MAIN_COLOR = "rgba(34,211,238,0.26)";
    let currentOpacity = 0.28;

    // 🔥 tuned for “alive” feel
    const stiffness = 0.05;
    const damping = 0.78;

    const STOP_DISTANCE = 0.06;
    const STOP_VELOCITY = 0.035;

    const handleMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    const targets = document.querySelectorAll("[data-magnetic]");

    const enterHandlers = [];
    const leaveHandlers = [];

    targets.forEach((el, index) => {
      const handleEnter = () => {
        magneticTarget = el;
      };

      const handleLeave = () => {
        if (magneticTarget === el) {
          magneticTarget = null;
        }
      };

      enterHandlers[index] = handleEnter;
      leaveHandlers[index] = handleLeave;

      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = Math.min((time - lastTime) / 16, 1.6);
      lastTime = time;

      let targetX = mouse.x;
      let targetY = mouse.y;

      // 🔥 smoother magnetic (less aggressive)
      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;

        const dx = cx - mouse.x;
        const dy = cy - mouse.y;

        const maxDist = 100;
        const distSq = dx * dx + dy * dy;

        if (distSq < maxDist * maxDist) {
          const dist = Math.sqrt(distSq);

          // 🔥 smoother falloff curve
          const strength = Math.pow(1 - dist / maxDist, 2) * 0.25;

          targetX += dx * strength;
          targetY += dy * strength;
        }
      }

      const dx = targetX - pos.x;
      const dy = targetY - pos.y;

      const isIdle =
        Math.abs(dx) < STOP_DISTANCE &&
        Math.abs(dy) < STOP_DISTANCE &&
        Math.abs(velocity.x) < STOP_VELOCITY &&
        Math.abs(velocity.y) < STOP_VELOCITY &&
        !magneticTarget;

      // 🔥 skip unnecessary updates
      if (!isIdle) {
        velocity.x += dx * stiffness * delta;
        velocity.y += dy * stiffness * delta;

        velocity.x *= damping;
        velocity.y *= damping;

        pos.x += velocity.x;
        pos.y += velocity.y;
      }

      const speedSq = velocity.x * velocity.x + velocity.y * velocity.y;

      // 🔥 softer stretch (less rubbery)
      const stretch = Math.min(speedSq * 0.012, 0.12);

      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch;

      const angle =
        speedSq > 0.001
          ? Math.atan2(velocity.y, velocity.x) * (180 / Math.PI)
          : 0;

      // 🔥 subtle breathing opacity
      const targetOpacity = magneticTarget ? 0.16 : 0.28;
      currentOpacity += (targetOpacity - currentOpacity) * 0.06;

      if (ballRef.current) {
        ballRef.current.style.transform = `
          translate3d(${pos.x}px, ${pos.y}px, 0)
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }

      if (glowRef.current) {
        glowRef.current.style.background = MAIN_COLOR;
        glowRef.current.style.opacity = currentOpacity;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMove);

      targets.forEach((el, index) => {
        el.removeEventListener("mouseenter", enterHandlers[index]);
        el.removeEventListener("mouseleave", leaveHandlers[index]);
      });

      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={ballRef}
      className="pointer-events-none fixed top-0 left-0 z-10 hidden md:block will-change-transform transform-gpu"
    >
      {/* core */}
      <div className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/85 blur-[0.5px]" />

      {/* glow */}
      <div
        ref={glowRef}
        className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full blur-md"
      />
    </div>
  );
}

export default CursorLight;
