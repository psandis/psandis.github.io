import { AnimatePresence, motion } from "framer-motion";
import Terminal from "./Terminal";

interface TerminalModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TerminalModal({ open, onClose }: TerminalModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <Terminal onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
