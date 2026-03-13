import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

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

export default function FloatingHeader() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <NameLogo />
      <nav className="flex items-center gap-6">
        <a
          href="https://drive.google.com/file/d/1KTgym750rA4502tvToMC2Z95BuEk9vf1/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          Resume
        </a>
        <a
          href="https://github.com/psandis"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/petrisandholm/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          LinkedIn
        </a>
      </nav>
    </motion.header>
  );
}
