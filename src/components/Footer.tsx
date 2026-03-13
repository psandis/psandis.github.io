import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center px-8 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 3.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="font-body text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Petri Sandholm. All rights reserved.
      </span>
    </motion.footer>
  );
}
