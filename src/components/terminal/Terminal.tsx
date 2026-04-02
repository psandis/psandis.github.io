import { useState, useRef, useEffect, useCallback } from "react";
import "./terminal.css";

interface Line {
  type: "input" | "output" | "error" | "ascii";
  text: string;
}

const ASCII_BANNER = `
 ██████╗ ███████╗    ████████╗███████╗██████╗ ███╗   ███╗
 ██╔══██╗██╔════╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
 ██████╔╝███████╗       ██║   █████╗  ██████╔╝██╔████╔██║
 ██╔═══╝ ╚════██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
 ██║     ███████║       ██║   ███████╗██║  ██║██║ ╚═╝ ██║
 ╚═╝     ╚══════╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
`.trimStart();

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "",
    "  about       Who I am",
    "  projects    List GitHub repositories",
    "  skills      Tech stack & tools",
    "  contact     How to reach me",
    "  clear       Clear terminal",
    "  ls          List available sections",
    "  help        Show this message",
  ],
  ls: () => [
    "about/    projects/    skills/    contact/",
  ],
  about: () => [
    "┌─────────────────────────────────────────────┐",
    "│  Petri Sandholm                              │",
    "│  Engineering Leader · 20+ years experience   │",
    "├─────────────────────────────────────────────┤",
    "│  Telecom · Banking · Large-scale platforms   │",
    "│  Based in Helsinki, Finland                  │",
    "│                                              │",
    "│  Currently building tools in the OpenClaw    │",
    "│  ecosystem and exploring AI/ML engineering.  │",
    "└─────────────────────────────────────────────┘",
  ],
  skills: () => [
    "Languages:",
    "  ██████████ TypeScript / JavaScript",
    "  ████████░░ Python",
    "  ███████░░░ Java",
    "",
    "Frontend:",
    "  React · Three.js · Tailwind · Framer Motion",
    "",
    "Backend & Tools:",
    "  Node.js · SQLite · n8n · Docker",
    "  AWS · GitHub Actions · Vitest · Biome",
    "",
    "AI/ML:",
    "  Claude API · OpenAI · LLM tooling",
  ],
  contact: () => [
    "┌─────────────────────────────────────────────┐",
    "│  GitHub    github.com/psandis               │",
    "│  LinkedIn  linkedin.com/in/petrisandholm     │",
    "│  Email     petri.sandholm@gmail.com          │",
    "└─────────────────────────────────────────────┘",
  ],
};

interface TerminalProps {
  onClose: () => void;
}

export default function Terminal({ onClose }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: "ascii", text: ASCII_BANNER },
    { type: "output", text: 'System online. Type "help" for commands.' },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [windowState, setWindowState] = useState<"normal" | "maximized" | "minimized">("normal");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: 640, h: 420 });
  const [clock, setClock] = useState("");
  const [cpu, setCpu] = useState(42.0);
  const [ramUsed, setRamUsed] = useState(18.4);
  const ramTotal = 32;

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Center on mount
  useEffect(() => {
    setPosition({
      x: Math.max(0, (window.innerWidth - size.w) / 2),
      y: Math.max(40, (window.innerHeight - size.h) / 2 - 40),
    });
  }, []);

  // Clock + system stats
  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString("en-US", { hour12: false }));
      setCpu((prev) => {
        const delta = (Math.random() - 0.5) * 8;
        return Math.min(99.9, Math.max(15, +(prev + delta).toFixed(1)));
      });
      setRamUsed((prev) => {
        const delta = (Math.random() - 0.5) * 1.2;
        return Math.min(ramTotal - 0.5, Math.max(8, +(prev + delta).toFixed(1)));
      });
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  // Focus input
  useEffect(() => {
    if (windowState !== "minimized") inputRef.current?.focus();
  }, [windowState]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (windowState === "maximized") return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, posX: position.x, posY: position.y };

    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPosition({
        x: dragRef.current.posX + (ev.clientX - dragRef.current.startX),
        y: dragRef.current.posY + (ev.clientY - dragRef.current.startY),
      });
    };

    const handleUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [windowState, position]);

  // Command handler
  const handleCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newLines: Line[] = [{ type: "input", text: `visitor@ps ~ $ ${cmd}` }];

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    if (trimmed === "") {
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (trimmed === "exit" || trimmed === "quit") {
      onClose();
      return;
    }

    if (trimmed === "projects") {
      newLines.push({ type: "output", text: "Fetching repos..." });
      setLines((prev) => [...prev, ...newLines]);

      fetch("https://api.github.com/users/psandis/repos?sort=updated&per_page=100")
        .then((res) => res.json())
        .then((repos) => {
          const output: Line[] = [
            { type: "output", text: "" },
            { type: "output", text: "GitHub Repositories:" },
            { type: "output", text: "─".repeat(50) },
          ];
          for (const repo of repos) {
            const lang = repo.language ? `[${repo.language}]` : "";
            const desc = repo.description ? ` - ${repo.description}` : "";
            const name = repo.name.padEnd(22);
            output.push({ type: "output", text: `  ${name} ${lang.padEnd(14)}${desc}` });
          }
          output.push({ type: "output", text: "─".repeat(50) });
          output.push({ type: "output", text: `  ${repos.length} repositories` });
          output.push({ type: "output", text: "" });
          setLines((prev) => {
            const idx = prev.findIndex((l) => l.text === "Fetching repos...");
            if (idx >= 0) return [...prev.slice(0, idx), ...output];
            return [...prev, ...output];
          });
        })
        .catch(() => {
          setLines((prev) => [...prev, { type: "error", text: "Error: Failed to fetch repositories" }]);
        });
      return;
    }

    const handler = COMMANDS[trimmed];
    if (handler) {
      for (const line of handler()) {
        newLines.push({ type: "output", text: line });
      }
      newLines.push({ type: "output", text: "" });
    } else {
      newLines.push({ type: "error", text: `command not found: ${trimmed}` });
      newLines.push({ type: "output", text: 'Type "help" for available commands.' });
      newLines.push({ type: "output", text: "" });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, [onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setHistory((prev) => [input, ...prev]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const next = historyIndex + 1;
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const next = historyIndex - 1;
        setHistoryIndex(next);
        setInput(history[next]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const stateClass = windowState === "maximized" ? "maximized" : windowState === "minimized" ? "minimized" : "";

  return (
    <div
      ref={containerRef}
      className={`cyber-terminal ${stateClass}`}
      style={windowState === "normal" ? { left: position.x, top: position.y, width: size.w, height: size.h } : undefined}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="cyber-titlebar" onMouseDown={handleDragStart}>
        <div className="cyber-titlebar-left">
          <div className="cyber-dots">
            <button
              className="cyber-dot cyber-dot-red"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              title="Close"
            />
            <button
              className="cyber-dot cyber-dot-yellow"
              onClick={(e) => { e.stopPropagation(); setWindowState((s) => s === "minimized" ? "normal" : "minimized"); }}
              title="Minimize"
            />
            <button
              className="cyber-dot cyber-dot-green"
              onClick={(e) => {
                e.stopPropagation();
                setWindowState((s) => s === "maximized" ? "normal" : "maximized");
              }}
              title="Maximize"
            />
          </div>
          <div className="cyber-status-dot" />
          <span className="cyber-status-label">System online</span>
        </div>

        <span className="cyber-titlebar-center">PS_TERMINAL</span>

        <span className="cyber-titlebar-right">{clock}</span>
      </div>

      {/* Body */}
      <div className="cyber-body" ref={scrollRef}>
        {lines.map((line, i) => (
          <div key={i} className={`cyber-line cyber-line-${line.type}`}>
            {line.text}
          </div>
        ))}

        <div className="cyber-input-line">
          <span className="cyber-prompt">visitor@ps ~ $&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="cyber-input"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="cyber-statusbar">
        <div className="cyber-statusbar-left">
          <span>RAM: <span className="sv-green">{ramUsed}TB / {ramTotal}TB</span></span>
          <span>CPU: <span className="sv-cyan">{cpu}%</span></span>
          <span>NET: <span className="sv-magenta">SECURE</span></span>
        </div>
        <div className="cyber-statusbar-right">
          <span>LOCATION: <span className="sv-amber">HELSINKI</span></span>
          <span className="sv-cyan">v2.077</span>
        </div>
      </div>
    </div>
  );
}
