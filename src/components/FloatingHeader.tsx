import { motion } from "framer-motion";

export default function FloatingHeader() {
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="font-display text-lg font-bold text-foreground tracking-wider">
PORTFOLIO
      </div>
      <nav className="flex items-center gap-6">
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
