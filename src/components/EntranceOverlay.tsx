import { motion } from "framer-motion";

export default function EntranceOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="text-center">
        <motion.h1
          className="font-display text-6xl md:text-8xl font-extrabold tracking-tight"
          style={{ color: "hsl(var(--foreground))" }}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: [0, 1, 1, 0], y: [40, 0, 0, -20], scale: [0.95, 1, 1, 1.02] }}
          transition={{ duration: 3, times: [0, 0.3, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-foreground">Selected</span>
          <br />
          Works
        </motion.h1>
      </div>
    </motion.div>
  );
}
