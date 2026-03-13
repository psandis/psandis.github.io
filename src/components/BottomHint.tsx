import { motion } from "framer-motion";

export default function BottomHint() {
  return (
    <motion.div
      className="fixed bottom-6 left-0 right-0 z-30 flex justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.8, duration: 1 }}
    >
      <p className="font-body text-xs text-muted-foreground tracking-widest uppercase">
        Drag or Scroll · Click to Explore
      </p>
    </motion.div>
  );
}
