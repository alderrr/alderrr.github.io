import { useEffect, useState } from "react";
import { FiExternalLink, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";
import emailjs from "emailjs-com";

const projects = [
  {
    title: "Rafflesia House",
    description:
      "Developing and maintaining web-based systems with a focus on clean architecture, performance, and user experience. Contributing to front-end and back-end development while collaborating with cross-functional teams to deliver scalable solutions.",
    tech: ["React", "Tailwind", "Responsive Design"],
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

const skills = [
  "JavaScript",
  "React",
  "Vite",
  "Tailwind CSS",
  "Node.js",
  "UI/UX",
  "REST API",
];

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) return;

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
      { threshold: 0.5 },
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
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
            <a
              href="#home"
              className="text-sm font-bold tracking-widest text-white"
            >
              ALDER.DEV
            </a>

            <nav className="hidden md:flex gap-6">
              <a
                href="#about"
                className={`transition ${
                  activeSection === "about"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                About
              </a>
              <a
                href="#projects"
                className={`transition ${
                  activeSection === "projects"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Projects
              </a>
              <a
                href="#experience"
                className={`transition ${
                  activeSection === "experience"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Experience
              </a>
              <a
                href="#contact"
                className={`transition ${
                  activeSection === "contact"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section id="home">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 min-h-[80vh] flex items-center">
            <div>
              <h1 className="reveal text-4xl sm:text-6xl font-bold text-white">
                Hi, I’m <span className="text-sky-400">Alif Dermayudha</span>
              </h1>

              <p className="reveal delay-1 mt-6 text-lg text-slate-300 max-w-xl">
                Full-Stack Developer building modern, scalable, and clean web
                applications.
              </p>

              <div className="reveal delay-2 mt-8 flex gap-4">
                <a
                  href="#projects"
                  className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition"
                >
                  View My Work
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
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <h2 className="reveal text-3xl font-bold text-white">About Me</h2>

            <p className="reveal delay-1 mt-6 text-slate-300 max-w-2xl leading-7">
              I build user-friendly applications with clean design and scalable
              architecture. I enjoy turning ideas into real-world digital
              products.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-white">Projects</h2>

            <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="reveal hover-lift border border-white/10 rounded-xl p-6 bg-white/5 hover:bg-white/10 transition"
                >
                  <h3 className="text-xl font-semibold text-white">
                    {project.title}
                  </h3>

                  <p className="mt-4 text-slate-300 text-sm">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-1 bg-white/10 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    {/* Live Demo */}
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition hover:text-sky-400"
                    >
                      <FiExternalLink size={18} />
                    </a>

                    {/* GitHub */}
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition hover:text-white"
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
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
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
        <section id="contact">
          <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold text-white">Contact</h2>

            <form
              onSubmit={handleSubmit}
              className="reveal mt-8 max-w-xl space-y-4"
            >
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
              />

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
              />

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Message"
                rows="5"
                required
                className="w-full p-3 rounded-lg bg-slate-900 border border-white/10"
              ></textarea>

              <button
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400 transition disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-8 flex justify-between text-sm text-slate-400">
            <p>© 2026 Alif Dermayudha</p>

            <div className="flex gap-4">
              <a href="https://github.com/alderrr">GitHub</a>
              <a href="https://www.linkedin.com/in/dermayudha/">LinkedIn</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
