import { useEffect, useState } from "react";
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
import { motion } from "framer-motion";
import emailjs from "emailjs-com";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateForm = () => {
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
  };

  const handleSubmit = async (e) => {
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
      await emailjs.send(
        "service_5jsh6yr",
        "template_k4dl3hv",
        form,
        "bX-lOjexAuPkZDJiJ",
      );

      setStatus("success");
      setForm({ name: "", email: "", message: "" });

      setToast({
        type: "success",
        message: "Message sent successfully!",
      });
    } catch (error) {
      console.log(error);
      setStatus("error");

      setToast({
        type: "error",
        message: "Failed to send message. Try again.",
      });
    }

    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CursorLight />
      <TouchRipple />
      <div className="relative z-20">
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] animate-toast-center">
            <div
              className={`px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-xl
        flex items-center gap-3 text-sm font-medium
        ${
          toast.type === "success"
            ? "bg-green-500/10 border-green-400/30 text-green-300"
            : "bg-red-500/10 border-red-400/30 text-red-300"
        }`}
            >
              <span className="text-xl flex items-center">
                {toast.type === "success" ? (
                  <FiCheckCircle className="text-green-400 scale-110" />
                ) : (
                  <FiXCircle className="text-red-400" />
                )}
              </span>

              <span>{toast.message}</span>
            </div>
          </div>
        )}
        <div className="min-h-screen text-slate-200">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12">
              <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md sm:px-5">
                <a
                  href="#home"
                  className="text-sm font-semibold tracking-[0.22em] text-white"
                >
                  ALDER.DEV
                </a>

                <nav className="hidden md:flex items-center gap-2">
                  {[
                    { id: "about", label: "About" },
                    { id: "projects", label: "Projects" },
                    { id: "experience", label: "Experience" },
                    { id: "contact", label: "Contact" },
                  ].map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="navbar-active-pill"
                            className="absolute inset-0 rounded-full bg-white/10"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}

                        <span className="relative z-10">{item.label}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section id="home">
            <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 min-h-[80vh] flex items-center">
              <div className="max-w-2xl">
                <p className="reveal text-sm uppercase tracking-[0.18em] text-sky-400">
                  Full-Stack JavaScript Developer
                </p>

                <h1 className="reveal mt-4 text-4xl sm:text-6xl font-bold text-white leading-tight">
                  I build scalable web apps with{" "}
                  <span className="text-sky-400">clean architecture</span> and{" "}
                  <span className="text-sky-400">great user experience</span>
                </h1>

                <p className="reveal delay-1 mt-6 text-lg text-slate-300 leading-8">
                  I specialize in React, Node.js, and modern web technologies to
                  deliver performant, maintainable, and production-ready
                  applications.
                </p>

                <div className="reveal delay-2 mt-8 flex gap-4">
                  <a
                    href="#projects"
                    className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
                  >
                    Explore Projects
                  </a>

                  <a
                    href="#contact"
                    className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10 transition"
                  >
                    Contact Me
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section id="about">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <h2 className="reveal text-3xl font-bold text-white">About Me</h2>

              <p className="reveal delay-1 mt-6 text-slate-300 max-w-2xl leading-7">
                I’m a Full-Stack JavaScript Developer focused on building
                scalable and maintainable web applications. I enjoy solving
                complex problems and turning ideas into reliable, user-friendly
                products.
              </p>

              <p className="reveal delay-1 mt-4 text-slate-300 max-w-2xl leading-7">
                My work combines strong front-end experience with solid back-end
                architecture, allowing me to deliver complete solutions from
                concept to deployment.
              </p>

              <p className="mt-8 text-sm uppercase tracking-[0.14em] text-slate-500">
                Core stack & tools
              </p>

              {/* Tech Stack Icons */}
              <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 text-3xl text-sky-400">
                {[
                  { icon: <FaReact />, name: "React" },
                  { icon: <SiVite />, name: "Vite" },
                  { icon: <FaNodeJs />, name: "Node.js" },
                  { icon: <SiTailwindcss />, name: "Tailwind" },
                  { icon: <FaHtml5 />, name: "HTML5" },
                  { icon: <FaCss3Alt />, name: "CSS3" },
                  { icon: <FaGitAlt />, name: "Git" },
                  { icon: <SiOpenai />, name: "OpenAI" },
                  { icon: <SiGooglegemini />, name: "Gemini" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                    title={item.name}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="scroll-mt-32">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-white">Projects</h2>

                <p className="mt-4 text-slate-400 leading-7">
                  Selected work showcasing my approach to building scalable and
                  maintainable web applications.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <div
                    key={project.title}
                    className="reveal hover-lift flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-sky-400/15 hover:bg-white/10"
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
                          className="rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 transition hover:border-sky-400/20 hover:bg-slate-900 hover:text-sky-400"
                      >
                        <FiExternalLink size={18} />
                      </a>

                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/60 transition hover:border-white/20 hover:bg-slate-900 hover:text-white"
                      >
                        <FaGithub size={18} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Experience */}
          <section id="experience">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <h2 className="text-3xl font-bold text-white">Experience</h2>

              <div className="mt-8 space-y-6">
                {experience.map((item, index) => (
                  <div
                    key={index}
                    className="reveal border-l border-white/20 pl-4"
                  >
                    <p className="text-sm text-slate-400">{item.period}</p>
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sky-400 text-sm">{item.organization}</p>
                    <p className="text-slate-300 text-sm mt-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-sky-400">
                  Contact
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                  Let’s work together
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                  Have a project, collaboration, or opportunity in mind? Send me
                  a message through the form or reach out directly by email.
                </p>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                {/* Direct Contact */}
                <div className="reveal rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition">
                  <h3 className="text-lg font-semibold text-white">
                    Direct contact
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Prefer email? Reach out directly and I’ll get back to you as
                    soon as possible.
                  </p>

                  <div className="mt-6 space-y-3">
                    <a
                      href="mailto:your@email.com"
                      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-4 transition hover:border-sky-400/20 hover:bg-slate-900"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                        <FiMail size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.14em] text-sky-400">
                          Email
                        </p>
                        <p className="truncate text-sm font-medium text-white">
                          alifdermayudha@gmail.com
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://www.linkedin.com/in/dermayudha/"
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-slate-900/70 px-4 py-4 transition hover:border-sky-400/20 hover:bg-slate-900"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-400/10 text-sky-300">
                        <FaLinkedin size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.14em] text-sky-400">
                          LinkedIn
                        </p>
                        <p className="truncate text-sm font-medium text-white">
                          Alif Dermayudha
                        </p>
                      </div>
                    </a>
                  </div>

                  <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-sky-400">
                      Availability
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Open to full-time opportunities, freelance projects, and
                      meaningful collaborations.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="reveal rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-white">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 ${
                          errors.name
                            ? "border-red-400/40 bg-slate-900"
                            : "border-white/10 bg-slate-900/80 focus:border-sky-400/40 focus:bg-slate-900 focus:ring-4 focus:ring-sky-400/10"
                        }`}
                      />
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          errors.name
                            ? "mt-2 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm text-red-300">
                            {errors.name || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label className="mb-2 block text-sm font-medium text-white">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 ${
                          errors.email
                            ? "border-red-400/40 bg-slate-900"
                            : "border-white/10 bg-slate-900/80 focus:border-sky-400/40 focus:bg-slate-900 focus:ring-4 focus:ring-sky-400/10"
                        }`}
                      />
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          errors.email
                            ? "mt-2 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm text-red-300">
                            {errors.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-white">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or opportunity..."
                        rows="6"
                        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-300 ${
                          errors.message
                            ? "border-red-400/40 bg-slate-900"
                            : "border-white/10 bg-slate-900/80 focus:border-sky-400/40 focus:bg-slate-900 focus:ring-4 focus:ring-sky-400/10"
                        }`}
                      ></textarea>
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          errors.message
                            ? "mt-2 grid-rows-[1fr] opacity-100"
                            : "mt-0 grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm text-red-300">
                            {errors.message || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-400">
                      I’ll get back to you as soon as possible.
                    </p>

                    <button
                      disabled={status === "loading"}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-60"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 mt-10">
            <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-400">
              {/* Left */}
              <div>
                <p>© 2026 Alif Dermayudha</p>
                <p className="text-xs text-slate-500 mt-1">
                  Built with React, Vite & Tailwind CSS
                </p>
              </div>

              {/* Right */}
              <div className="flex gap-4">
                <a
                  href="https://github.com/alderrr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/dermayudha/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
