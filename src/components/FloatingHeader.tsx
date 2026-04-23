import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X, TerminalSquare } from "lucide-react";

function NameLogo() {
  const [cycle, setCycle] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCycle(c => c + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const words = ["Petri", "Sandholm"];

  return (
    <a
      href="/"
      className="relative flex flex-col no-underline"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-2">
        <img src="/ps-logo.png" alt="PS" className="w-7 h-7 rounded" />
        <AnimatePresence mode="wait">
          <motion.div
            key={cycle}
            className="flex items-center gap-1.5"
            initial="enter"
            animate="visible"
            exit="exit"
            variants={{
              enter: {},
              visible: { transition: { staggerChildren: 0.1 } },
              exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${cycle}-${i}`}
                className={`font-display text-lg inline-block ${i === 0 ? "font-bold text-foreground" : "font-medium text-muted-foreground"}`}
                variants={{
                  enter: { opacity: 0, x: 40, rotateY: -45 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  },
                  exit: {
                    opacity: 0,
                    x: -30,
                    rotateY: 30,
                    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
                  },
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="rounded-full"
          style={{ backgroundColor: "hsl(var(--primary))" }}
          animate={{ width: hovered ? 0 : 6, height: hovered ? 0 : 6, opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <motion.div
        className="rounded-full mt-0.5"
        style={{ backgroundColor: "hsl(var(--primary))", height: 2 }}
        animate={{ width: hovered ? "100%" : 0, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </a>
  );
}

const navLinks = [
  { href: "https://drive.google.com/file/d/1KTgym750rA4502tvToMC2Z95BuEk9vf1/view?usp=drive_link", label: "Resume" },
  { href: "https://github.com/psandis", label: "GitHub" },
  { href: "https://www.linkedin.com/in/petrisandholm/", label: "LinkedIn" },
];

export default function FloatingHeader({ onTerminalOpen }: { onTerminalOpen?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 sm:px-8 sm:py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <NameLogo />

      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-6">
        <button
          onClick={onTerminalOpen}
          className="nav-pulse font-body text-sm flex items-center gap-1.5"
          style={{ animationDelay: "0s" }}
        >
          <TerminalSquare className="w-4 h-4" />
          Terminal
        </button>
        {navLinks.map(({ href, label }, i) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-pulse font-body text-sm"
            style={{ animationDelay: `${(i + 1) * 0.8}s` }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
      >
        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="absolute top-full right-4 mt-1 flex flex-col gap-3 p-4 rounded-xl sm:hidden"
            style={{ backgroundColor: "hsl(var(--background) / 0.9)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => { setMenuOpen(false); onTerminalOpen?.(); }}
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1.5"
            >
              <TerminalSquare className="w-4 h-4" />
              Terminal
            </button>
            {navLinks.map(({ href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
