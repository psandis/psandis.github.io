import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github } from "lucide-react";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const formatDate = (value: string) => {
  if (!value) return "";
  return `Updated ${new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))}`;
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "hsl(var(--background) / 0.4)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-heavy rounded-2xl p-8 max-w-lg w-full pointer-events-auto relative overflow-hidden"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Accent glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: project.color }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors duration-300"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Thumbnail */}
              <img
                src={`/projects/${project.title}.png`}
                alt={project.title}
                className="w-full h-40 object-cover rounded-lg mb-4 mt-2"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (img.src.endsWith('.png')) {
                    img.src = `/projects/${project.title}.jpg`;
                  } else {
                    img.style.display = 'none';
                  }
                }}
              />

              {/* Title */}
              <h2 className="font-display text-3xl font-bold text-foreground mb-3">
                {project.title}
              </h2>

              {/* Description */}
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                {project.description || "No description provided."}
              </p>

              {/* Last updated */}
              {project.updatedAt && (
                <p className="font-body text-xs text-muted-foreground mb-4">
                  {formatDate(project.updatedAt)}
                </p>
              )}

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs font-body font-medium border border-border text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-semibold text-sm transition-all duration-300 neon-glow"
                  style={{ backgroundColor: project.color, color: "hsl(var(--primary-foreground))" }}
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-medium text-sm border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
