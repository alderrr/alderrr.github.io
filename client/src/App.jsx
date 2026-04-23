import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiExternalLink,
  FiCheckCircle,
  FiXCircle,
  FiMail,
} from "react-icons/fi";
import {
  FaGithub,
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
  FaLinkedin,
} from "react-icons/fa";
import {
  SiTailwindcss,
  SiGooglegemini,
  SiOpenai,
  SiVite,
} from "react-icons/si";
import {
  // eslint-disable-next-line no-unused-vars
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import CursorLight from "./Cursor";
import TouchRipple from "./Touch";

const projects = [
  {
    title: "Rafflesia House",
    description:
      "A web-based system built to manage and present property information with a focus on performance and usability. I worked on both the front-end and back-end, improving application structure and responsiveness.",
    tech: ["React", "Tailwind", "Node.js"],
    live: "https://rafflesiahouse.netlify.app/",
    github: "https://github.com/alderrr/rafflesia-house",
  },
];

const experience = [
  {
    period: "2024 — Present",
    title: "Full-Stack Developer",
    organization: "PT. Supranusa Sindata",
    description:
      "Developing and maintaining web-based systems with a focus on clean architecture, performance, and user experience. Contributing to front-end and back-end development while collaborating with cross-functional teams to deliver scalable solutions.",
  },
  {
    period: "2023 — 2023",
    title: "Full Stack JavaScript Program",
    organization: "Hacktiv8",
    description:
      "Completed an intensive full-stack program covering JavaScript, React, Node.js, and modern web development practices. Built multiple real-world projects with a focus on problem solving, application structure, and best practices.",
  },
  {
    period: "2016 — 2020",
    title: "Bachelor of Civil Engineering",
    organization: "Parahyangan Catholic University",
    description:
      "Developed strong analytical and problem-solving skills, providing a foundation for transitioning into software development and building structured, scalable systems.",
  },
];

const navItems = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

const sectionPerformanceStyle = {
  contentVisibility: "auto",
  containIntrinsicSize: "900px",
};

const springFast = {
  type: "spring",
  stiffness: 360,
  damping: 28,
  mass: 0.45,
};

const springCard = {
  type: "spring",
  stiffness: 280,
  damping: 24,
  mass: 0.55,
};

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [effectsReady, setEffectsReady] = useState(false);

  const toastTimeoutRef = useRef(null);
  const idleCallbackRef = useRef(null);
  const timeoutFallbackRef = useRef(null);
  const emailJsModuleRef = useRef(null);
  const isManualScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll();
  const rawHeroY = useTransform(
    scrollY,
    [0, 700],
    [0, prefersReducedMotion ? 0 : 56],
  );
  const rawHeroGlowY = useTransform(
    scrollY,
    [0, 700],
    [0, prefersReducedMotion ? 0 : 84],
  );
  const rawHeroOpacity = useTransform(
    scrollY,
    [0, 350],
    [1, prefersReducedMotion ? 1 : 0.82],
  );

  const heroY = useSpring(rawHeroY, {
    stiffness: 120,
    damping: 22,
    mass: 0.35,
  });
  const heroGlowY = useSpring(rawHeroGlowY, {
    stiffness: 110,
    damping: 24,
    mass: 0.4,
  });
  const heroOpacity = useSpring(rawHeroOpacity, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  const techStack = useMemo(
    () => [
      { icon: <FaReact />, name: "React" },
      { icon: <SiVite />, name: "Vite" },
      { icon: <FaNodeJs />, name: "Node.js" },
      { icon: <SiTailwindcss />, name: "Tailwind" },
      { icon: <FaHtml5 />, name: "HTML5" },
      { icon: <FaCss3Alt />, name: "CSS3" },
      { icon: <FaGitAlt />, name: "Git" },
      { icon: <SiOpenai />, name: "OpenAI" },
      { icon: <SiGooglegemini />, name: "Gemini" },
    ],
    [],
  );

  const warmEmailJs = useCallback(async () => {
    if (!emailJsModuleRef.current) {
      emailJsModuleRef.current = import("emailjs-com").then(
        (module) => module.default,
      );
    }

    return emailJsModuleRef.current;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const validateForm = useCallback(() => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please enter your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "Please enter your message.";
    } else if (form.message.trim().length < 10) {
      nextErrors.message = "Message should be at least 10 characters.";
    }

    return nextErrors;
  }, [form]);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setStatus("error");
        return;
      }

      setErrors({});
      setStatus("loading");

      try {
        const emailjs = await warmEmailJs();

        await emailjs.send(
          "service_5jsh6yr",
          "template_k4dl3hv",
          form,
          "bX-lOjexAuPkZDJiJ",
        );

        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        showToast("success", "Message sent successfully!");
      } catch (error) {
        console.log(error);
        setStatus("error");
        showToast("error", "Failed to send message.");
      }
    },
    [form, showToast, validateForm, warmEmailJs],
  );

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      idleCallbackRef.current = window.requestIdleCallback(
        () => setEffectsReady(true),
        { timeout: 500 },
      );
    } else {
      timeoutFallbackRef.current = window.setTimeout(() => {
        setEffectsReady(true);
      }, 280);
    }

    return () => {
      if (idleCallbackRef.current && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleCallbackRef.current);
      }

      if (timeoutFallbackRef.current) {
        clearTimeout(timeoutFallbackRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section"));
    if (!sections.length) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        let visibleSection = null;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            visibleSection = entry.target.id;
          }
        }

        if (visibleSection && !isManualScrollingRef.current) {
          setActiveSection((prev) =>
            prev === visibleSection ? prev : visibleSection,
          );
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal"));
    if (!elements.length) return;

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.01,
      },
    );

    elements.forEach((el) => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {effectsReady && <CursorLight />}
      {effectsReady && <TouchRipple />}

      <div className="relative z-20">
        {toast && (
          <motion.div
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: -10, scale: 0.98 }
            }
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion ? {} : { opacity: 0, y: -8, scale: 0.98 }
            }
            transition={springFast}
            className="fixed top-6 left-1/2 z-[999] -translate-x-1/2 will-change-transform"
          >
            <div
              className={`flex items-center gap-3 rounded-2xl border px-5 py-3 text-sm font-medium shadow-sm ${
                toast.type === "success"
                  ? "border-green-400/20 bg-slate-900/95 text-green-300"
                  : "border-red-400/20 bg-slate-900/95 text-red-300"
              }`}
            >
              <span className="text-lg">
                {toast.type === "success" ? <FiCheckCircle /> : <FiXCircle />}
              </span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}

        <div className="min-h-screen text-slate-200">
          <header className="sticky top-0 z-50 border-b border-white/8 bg-slate-950/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
              <div className="flex items-center justify-between rounded-full border border-white/8 bg-slate-900/70 px-4 py-3 sm:px-5">
                <motion.a
                  href="#home"
                  data-magnetic
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
                  transition={springFast}
                  className="text-sm font-semibold tracking-[0.22em] text-white"
                >
                  ALDER.DEV
                </motion.a>

                <nav className="hidden items-center gap-2 md:flex">
                  {navItems.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => {
                          if (scrollTimeoutRef.current) {
                            clearTimeout(scrollTimeoutRef.current);
                          }
                          isManualScrollingRef.current = true;
                          setActiveSection(item.id);
                          scrollTimeoutRef.current = setTimeout(() => {
                            isManualScrollingRef.current = false;
                          }, 500);
                        }}
                        data-magnetic
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.98 }
                        }
                        transition={springFast}
                        className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-150 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="navbar-active-pill"
                            className="absolute inset-0 rounded-full bg-white/8"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 32,
                              mass: 0.5,
                            }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </motion.a>
                    );
                  })}
                </nav>
              </div>
            </div>
          </header>

          <section id="home" className="relative overflow-hidden">
            {!prefersReducedMotion && (
              <>
                <motion.div
                  aria-hidden="true"
                  style={{ y: heroGlowY }}
                  className="pointer-events-none absolute inset-x-0 top-[-10rem] mx-auto h-[24rem] w-[24rem] rounded-full bg-sky-400/8 blur-3xl"
                />
                <motion.div
                  aria-hidden="true"
                  style={{ y: heroY }}
                  className="pointer-events-none absolute right-[8%] top-[20%] hidden h-40 w-40 rounded-full bg-white/4 blur-2xl lg:block"
                />
              </>
            )}

            <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
              <motion.div
                style={
                  prefersReducedMotion
                    ? undefined
                    : { y: heroY, opacity: heroOpacity }
                }
                className="max-w-2xl will-change-transform transform-gpu"
              >
                <p className="reveal text-sm uppercase tracking-[0.18em] text-sky-400">
                  Full-Stack JavaScript Developer
                </p>

                <h1 className="reveal mt-5 max-w-[18ch] text-4xl sm:text-6xl leading-[1.1] tracking-[-0.02em] font-semibold text-white">
                  I build scalable web apps with{" "}
                  <span className="text-white">clean architecture</span> and{" "}
                  <span className="text-sky-400">great user experience</span>
                </h1>

                <p className="reveal delay-1 mt-6 max-w-[48ch] text-base sm:text-lg leading-relaxed text-slate-400">
                  I specialize in React, Node.js, and modern web technologies to
                  deliver performant, maintainable, and production-ready
                  applications.
                </p>

                <div className="reveal delay-2 mt-8 flex gap-4">
                  <motion.a
                    href="#projects"
                    onClick={() => {
                      setActiveSection("projects");
                    }}
                    data-magnetic
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -2,
                            scale: 1.015,
                            boxShadow: "0 10px 30px rgba(56,189,248,0.18)",
                          }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.985 }
                    }
                    transition={springFast}
                    className="rounded-lg bg-sky-500 px-6 py-3 font-semibold text-black transition-colors duration-150 hover:bg-sky-400 will-change-transform transform-gpu"
                  >
                    Explore Projects
                  </motion.a>

                  <motion.a
                    href="#contact"
                    onClick={() => {
                      setActiveSection("contact");
                    }}
                    data-magnetic
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -2,
                            scale: 1.012,
                            backgroundColor: "rgba(255,255,255,0.05)",
                          }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.985 }
                    }
                    transition={springFast}
                    className="rounded-lg border border-white/15 px-6 py-3 transition-colors duration-150 will-change-transform transform-gpu"
                  >
                    Contact Me
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="about" style={sectionPerformanceStyle}>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <h2 className="reveal text-3xl font-bold text-white">About Me</h2>

              <p className="reveal delay-1 mt-6 max-w-2xl leading-7 text-slate-300">
                I’m a Full-Stack JavaScript Developer focused on building
                scalable and maintainable web applications. I enjoy solving
                complex problems and turning ideas into reliable, user-friendly
                products.
              </p>

              <p className="reveal delay-1 mt-4 max-w-2xl leading-7 text-slate-300">
                My work combines strong front-end experience with solid back-end
                architecture, allowing me to deliver complete solutions from
                concept to deployment.
              </p>

              <p className="mt-8 text-sm uppercase tracking-[0.14em] text-slate-500">
                Core stack & tools
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-3xl text-sky-400 sm:gap-6">
                {techStack.map((item) => (
                  <motion.div
                    key={item.name}
                    title={item.name}
                    whileHover={
                      prefersReducedMotion ? undefined : { y: -2, scale: 1.03 }
                    }
                    transition={springFast}
                    className="rounded-xl border border-white/8 bg-slate-900/60 p-3 transition-colors duration-150 hover:bg-slate-900 will-change-transform transform-gpu"
                  >
                    {item.icon}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" style={sectionPerformanceStyle}>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-white">Projects</h2>

                <p className="mt-4 leading-7 text-slate-400">
                  Selected work showcasing my approach to building scalable and
                  maintainable web applications.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <motion.div
                    key={project.title}
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -4,
                            scale: 1.01,
                            borderColor: "rgba(255,255,255,0.12)",
                          }
                    }
                    transition={springCard}
                    className="reveal hover-lift flex flex-col rounded-2xl border border-white/8 bg-slate-900/60 p-6 transition-transform duration-150 will-change-transform transform-gpu"
                  >
                    <h3 className="text-xl font-semibold text-white">
                      {project.title}
                    </h3>

                    <p className="mt-4 flex-grow text-sm leading-7 text-slate-300">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/8 bg-slate-950/70 px-3 py-1 text-xs text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <motion.a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        data-magnetic
                        whileHover={
                          prefersReducedMotion
                            ? undefined
                            : { y: -2, scale: 1.05 }
                        }
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.97 }
                        }
                        transition={springFast}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-slate-950/70 transition-colors duration-150 hover:text-sky-400 will-change-transform transform-gpu"
                      >
                        <FiExternalLink size={18} />
                      </motion.a>

                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        data-magnetic
                        whileHover={
                          prefersReducedMotion
                            ? undefined
                            : { y: -2, scale: 1.05 }
                        }
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.97 }
                        }
                        transition={springFast}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-slate-950/70 transition-colors duration-150 hover:text-white will-change-transform transform-gpu"
                      >
                        <FaGithub size={18} />
                      </motion.a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" style={sectionPerformanceStyle}>
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <h2 className="text-3xl font-bold text-white">Experience</h2>

              <div className="mt-8 space-y-6">
                {experience.map((item) => (
                  <motion.div
                    key={`${item.period}-${item.title}`}
                    whileHover={prefersReducedMotion ? undefined : { x: 2 }}
                    transition={springFast}
                    className="reveal border-l border-white/15 pl-4 will-change-transform transform-gpu"
                  >
                    <p className="text-sm text-slate-400">{item.period}</p>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-sky-400">{item.organization}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="contact"
            className="relative"
            style={sectionPerformanceStyle}
          >
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-400">
                  Contact
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Let’s work together
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                  Have a project or opportunity in mind? Send a message or reach
                  out directly.
                </p>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <motion.div
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  transition={springCard}
                  className="rounded-2xl border border-white/8 bg-slate-900/70 p-6 will-change-transform transform-gpu"
                >
                  <h3 className="text-lg font-semibold text-white">
                    Direct contact
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Prefer email? I’ll respond as soon as possible.
                  </p>

                  <div className="mt-6 space-y-3">
                    <motion.a
                      href="mailto:alifdermayudha@gmail.com"
                      data-magnetic
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : { y: -2, scale: 1.01 }
                      }
                      whileTap={
                        prefersReducedMotion ? undefined : { scale: 0.99 }
                      }
                      transition={springFast}
                      className="flex items-center gap-4 rounded-xl border border-white/8 px-4 py-4 transition-colors duration-150 hover:border-sky-400/30 will-change-transform transform-gpu"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                        <FiMail size={18} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-sky-400">
                          Email
                        </p>
                        <p className="text-sm font-medium text-white">
                          alifdermayudha@gmail.com
                        </p>
                      </div>
                    </motion.a>

                    <motion.a
                      href="https://www.linkedin.com/in/dermayudha/"
                      target="_blank"
                      rel="noreferrer"
                      data-magnetic
                      whileHover={
                        prefersReducedMotion
                          ? undefined
                          : { y: -2, scale: 1.01 }
                      }
                      whileTap={
                        prefersReducedMotion ? undefined : { scale: 0.99 }
                      }
                      transition={springFast}
                      className="flex items-center gap-4 rounded-xl border border-white/8 px-4 py-4 transition-colors duration-150 hover:border-sky-400/30 will-change-transform transform-gpu"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                        <FaLinkedin size={18} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-sky-400">
                          LinkedIn
                        </p>
                        <p className="text-sm font-medium text-white">
                          Alif Dermayudha
                        </p>
                      </div>
                    </motion.a>
                  </div>

                  <div className="mt-6 border-t border-white/8 pt-6">
                    <p className="text-xs uppercase tracking-[0.14em] text-sky-400">
                      Availability
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Open to full-time roles, freelance projects, and
                      collaborations.
                    </p>
                  </div>
                </motion.div>

                <motion.form
                  onSubmit={handleSubmit}
                  onPointerEnter={warmEmailJs}
                  onFocus={warmEmailJs}
                  noValidate
                  whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                  transition={springCard}
                  className="rounded-2xl border border-white/8 bg-slate-900/70 p-6 will-change-transform transform-gpu"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`w-full rounded-xl touch-manipulation border px-4 py-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-slate-500 ${
                          errors.name
                            ? "border-red-400/40 bg-slate-950"
                            : "border-white/8 bg-slate-950 focus:border-sky-400/40"
                        }`}
                      />

                      <p
                        className={`mt-2 text-sm text-red-300 transition-opacity duration-150 ${
                          errors.name ? "opacity-100" : "h-0 opacity-0"
                        }`}
                      >
                        {errors.name || ""}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-300">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full rounded-xl touch-manipulation border px-4 py-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-slate-500 ${
                          errors.email
                            ? "border-red-400/40 bg-slate-950"
                            : "border-white/8 bg-slate-950 focus:border-sky-400/40"
                        }`}
                      />

                      <p
                        className={`mt-2 text-sm text-red-300 transition-opacity duration-150 ${
                          errors.email ? "opacity-100" : "h-0 opacity-0"
                        }`}
                      >
                        {errors.email || ""}
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm text-slate-300">
                        Message
                      </label>

                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows="5"
                        placeholder="Tell me about your project..."
                        className={`w-full resize-none rounded-xl touch-manipulation border px-4 py-3 text-sm text-white outline-none transition-colors duration-150 placeholder:text-slate-500 ${
                          errors.message
                            ? "border-red-400/40 bg-slate-950"
                            : "border-white/8 bg-slate-950 focus:border-sky-400/40"
                        }`}
                      />

                      <p
                        className={`mt-2 text-sm text-red-300 transition-opacity duration-150 ${
                          errors.message ? "opacity-100" : "h-0 opacity-0"
                        }`}
                      >
                        {errors.message || ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                      I’ll get back to you shortly.
                    </p>

                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      data-magnetic
                      whileHover={
                        prefersReducedMotion || status === "loading"
                          ? undefined
                          : {
                              y: -2,
                              scale: 1.015,
                              boxShadow: "0 10px 28px rgba(56,189,248,0.16)",
                            }
                      }
                      whileTap={
                        prefersReducedMotion || status === "loading"
                          ? undefined
                          : { scale: 0.985 }
                      }
                      transition={springFast}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-colors duration-150 hover:bg-sky-400 disabled:opacity-60 will-change-transform transform-gpu"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                          Sending
                        </>
                      ) : (
                        "Send"
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              </div>
            </div>
          </section>

          <footer className="mt-8 border-t border-white/8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p>© 2026 Alif Dermayudha</p>
                <p className="mt-1 text-xs text-slate-600">
                  Built with React, Vite, Tailwind CSS, & OpenAI
                </p>
              </div>

              <div className="flex gap-6">
                <motion.a
                  href="https://github.com/alderrr"
                  target="_blank"
                  rel="noreferrer"
                  data-magnetic
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -2, color: "#ffffff" }
                  }
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  transition={springFast}
                  className="text-slate-400 transition-all duration-150 will-change-transform transform-gpu"
                >
                  GitHub
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/dermayudha/"
                  target="_blank"
                  rel="noreferrer"
                  data-magnetic
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : { y: -2, color: "#ffffff" }
                  }
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  transition={springFast}
                  className="text-slate-400 transition-all duration-150 will-change-transform transform-gpu"
                >
                  LinkedIn
                </motion.a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
