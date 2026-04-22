import { useEffect, useRef } from "react";

function CursorLight() {
  const ballRef = useRef(null);

  useEffect(() => {
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: mouse.x, y: mouse.y };
    let velocity = { x: 0, y: 0 };

    let magneticTarget = null;
    let currentColor = "rgba(34,211,238,0.35)";
    let currentOpacity = 0.5;

    const stiffness = 0.07;
    const damping = 0.72;

    const STOP_DISTANCE = 0.1;
    const STOP_VELOCITY = 0.05;

    const move = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", move);

    const targets = document.querySelectorAll(
      "a, button, input, textarea, select",
    );

    targets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        magneticTarget = el;
      });
      el.addEventListener("mouseleave", () => {
        magneticTarget = null;
      });
    });

    const sectionColors = {
      home: "rgba(34,211,238,0.35)",
      about: "rgba(59,130,246,0.35)",
      projects: "rgba(168,85,247,0.35)",
      experience: "rgba(16,185,129,0.35)",
      contact: "rgba(244,63,94,0.35)",
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            currentColor = sectionColors[entry.target.id] || currentColor;
          }
        });
      },
      { threshold: 0.6 },
    );

    document.querySelectorAll("section").forEach((s) => observer.observe(s));

    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 16;
      lastTime = time;

      let targetX = mouse.x;
      let targetY = mouse.y;

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const distX = cx - mouse.x;
        const distY = cy - mouse.y;
        const distance = Math.sqrt(distX ** 2 + distY ** 2);

        const maxDistance = 120;

        if (distance < maxDistance) {
          const strength = (1 - distance / maxDistance) * 0.35;
          targetX += distX * strength;
          targetY += distY * strength;
        }
      }

      const dx = targetX - pos.x;
      const dy = targetY - pos.y;

      const isSlow =
        Math.abs(dx) < STOP_DISTANCE &&
        Math.abs(dy) < STOP_DISTANCE &&
        Math.abs(velocity.x) < STOP_VELOCITY &&
        Math.abs(velocity.y) < STOP_VELOCITY;

      if (isSlow) {
        pos.x += dx * 0.08;
        pos.y += dy * 0.08;

        velocity.x *= 0.6;
        velocity.y *= 0.6;
      } else {
        velocity.x += dx * stiffness * delta;
        velocity.y += dy * stiffness * delta;

        velocity.x *= damping;
        velocity.y *= damping;

        pos.x += velocity.x;
        pos.y += velocity.y;
      }

      const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
      const stretch = Math.min(speed * 0.02, 0.25);

      const scaleX = 1 + stretch;
      const scaleY = 1 - stretch;

      const angle =
        speed > 0.1 ? Math.atan2(velocity.y, velocity.x) * (180 / Math.PI) : 0;

      const targetOpacity = magneticTarget ? 0.2 : 0.5;
      currentOpacity += (targetOpacity - currentOpacity) * 0.06;

      if (ballRef.current) {
        // ONLY wrapper moves/rotates/scales
        ballRef.current.style.transform = `
          translate3d(${pos.x}px, ${pos.y}px, 0)
          rotate(${angle}deg)
          scale(${scaleX}, ${scaleY})
        `;

        const glow = ballRef.current.querySelector(".glow");
        if (glow) {
          glow.style.background = currentColor;
          glow.style.opacity = currentOpacity;
        }
      }

      requestAnimationFrame(animate);
    };

    animate(lastTime);

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ballRef}
      className="pointer-events-none fixed top-0 left-0 z-10 mix-blend-screen"
    >
      {/* core */}
      <div className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[1px]" />

      {/* glow (NO transform inheritance issues now) */}
      <div className="glow absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl opacity-50" />
    </div>
  );
}

export default CursorLight;
