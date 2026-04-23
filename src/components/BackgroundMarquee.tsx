import { motion } from "framer-motion";

const LINES = [
  "Software Engineer  ·  Creative Developer  ·  Problem Solver",
  "Clean Code  ·  Scalable Systems  ·  Modern Web",
  "Design Thinking  ·  Full Stack  ·  Open Source",
];

const SPEED = 60; // seconds per loop, slow and calm

export default function BackgroundMarquee() {
  return (
    <div className="fixed inset-x-0 top-16 z-10 pointer-events-none overflow-hidden flex flex-col gap-3 opacity-[0.04]">
      {LINES.map((text, i) => {
        const reverse = i % 2 === 1;
        const repeated = (text + "  ·  ").repeat(4);
        return (
          <div key={i} className="whitespace-nowrap overflow-hidden">
            <motion.div
              className="inline-block font-display text-2xl md:text-3xl font-extrabold tracking-wide text-foreground will-change-transform"
              initial={{ x: reverse ? "-25%" : "0%" }}
              animate={{ x: reverse ? "0%" : "-25%" }}
              transition={{ duration: SPEED, ease: "linear", repeat: Infinity }}
            >
              {repeated}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
