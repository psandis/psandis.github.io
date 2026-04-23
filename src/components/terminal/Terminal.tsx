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
    "  whoami      One-liner identity",
    "  projects    List GitHub repositories",
    "  skills      Tech stack & tools",
    "  contact     How to reach me",
    "  ls          List available sections",
    "  pwd         Current path",
    "  date        Current date and time",
    "  resume      Open resume PDF",
    "  open        open github | linkedin | resume",
    "  tmux        Split pane view",
    "  clear       Clear terminal",
    "  help        Show this message",
  ],
  ls: () => [
    "about/    projects/    skills/    contact/",
  ],
  whoami: () => [
    "petri sandholm",
    "engineering manager, builder, 25+ years in telecom, banking, and cloud",
  ],
  pwd: () => [
    "/home/petri/life/work/building-things",
  ],
  date: () => [
    new Date().toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  ],
  about: () => [
    "┌──────────────────────────────────────────────────┐",
    "│  Petri Sandholm                                  │",
    "│  Engineering Manager · 25+ years experience      │",
    "├──────────────────────────────────────────────────┤",
    "│  Telecom · Banking · Regulated environments      │",
    "│  Cloud · Integration · Salesforce · Observability │",
    "│                                                  │",
    "│  MBA, Information Systems Management             │",
    "│  AWS Certified · SAFe PM/PO · ITIL               │",
    "│                                                  │",
    "│  Open to relocation · EU work authorization      │",
    "└──────────────────────────────────────────────────┘",
  ],
  skills: () => [
    "Languages & Scripting:",
    "  SQL              ■■■■■  Expert",
    "  JavaScript       ■■■■□  Advanced",
    "  PHP              ■■■■□  Advanced",
    "  TypeScript       ■■■□□  Proficient",
    "  Java             ■■■□□  Proficient",
    "  Python           ■■■□□  Proficient",
    "  Bash/Shell       ■■■□□  Proficient",
    "",
    "Cloud & Infrastructure:",
    "  AWS              ■■■■□  Advanced",
    "  Azure            ■■■□□  Proficient",
    "  Docker           ■■■■□  Advanced",
    "  Terraform        ■■■□□  Proficient",
    "  GCP              ■■■□□  Proficient",
    "  Ansible          ■■□□□  Familiar",
    "  Kubernetes       ■■□□□  Familiar",
    "",
    "Integration & Messaging:",
    "  REST/SOAP        ■■■■■  Expert",
    "  TIBCO BW/EMS     ■■■■□  Advanced",
    "  Kafka            ■■■□□  Proficient",
    "  Apigee           ■■■□□  Proficient",
    "",
    "Platforms:",
    "  Salesforce       ■■■■□  Advanced",
    "  WordPress        ■■■■□  Advanced",
    "  Comarch CRM      ■■■■□  Advanced",
    "",
    "Observability:",
    "  Elastic Stack    ■■■■□  Advanced",
    "  Splunk           ■■■□□  Proficient",
    "  Grafana          ■■■□□  Proficient",
    "",
    "CI/CD & Dev Tools:",
    "  Jira             ■■■■□  Advanced",
    "  Confluence       ■■■■□  Advanced",
    "  GitHub Actions   ■■■■□  Advanced",
    "  Jenkins          ■■■□□  Proficient",
    "  Linear           ■■■□□  Proficient",
    "",
    "Databases:",
    "  Oracle           ■■■□□  Proficient",
    "  PostgreSQL       ■■■■□  Advanced",
    "  MySQL            ■■■■□  Advanced",
    "  DB2              ■■■□□  Proficient",
    "  Redis            ■■□□□  Familiar",
    "",
    "AI:",
    "  Claude           ■■■■□  Advanced",
    "  OpenAI           ■■■■□  Advanced",
    "  Gemini           ■■■■□  Advanced",
  ],
  contact: () => [
    "┌─────────────────────────────────────────────┐",
    "│  GitHub    github.com/psandis               │",
    "│  LinkedIn  linkedin.com/in/petrisandholm     │",
    "│  Email     petri.sandholm@gmail.com          │",
    "└─────────────────────────────────────────────┘",
  ],
};

// ── System Info Pane ──
function SystemPane({ cpu, ramUsed, ramTotal, clock }: { cpu: number; ramUsed: number; ramTotal: number; clock: string }) {
  const uptime = useRef(0);
  const [uptimeStr, setUptimeStr] = useState("00:00:00");

  useEffect(() => {
    const id = setInterval(() => {
      uptime.current += 1;
      const h = String(Math.floor(uptime.current / 3600)).padStart(2, "0");
      const m = String(Math.floor((uptime.current % 3600) / 60)).padStart(2, "0");
      const s = String(uptime.current % 60).padStart(2, "0");
      setUptimeStr(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const cpuBar = Math.round(cpu / 5);
  const ramBar = Math.round((ramUsed / ramTotal) * 20);

  return (
    <div className="tmux-pane tmux-pane-info">
      <div className="pane-header">── system ──</div>
      <div className="pane-content">
        <div className="cyber-line cyber-line-output">  CLOCK    {clock}</div>
        <div className="cyber-line cyber-line-output">  UPTIME   {uptimeStr}</div>
        <div className="cyber-line cyber-line-output"> </div>
        <div className="cyber-line cyber-line-output">  CPU  [{("█".repeat(cpuBar) + "░".repeat(20 - cpuBar))}] <span className="sv-cyan">{cpu}%</span></div>
        <div className="cyber-line cyber-line-output">  RAM  [{("█".repeat(ramBar) + "░".repeat(20 - ramBar))}] <span className="sv-green">{ramUsed}/{ramTotal}TB</span></div>
        <div className="cyber-line cyber-line-output"> </div>
        <div className="cyber-line cyber-line-output">  NET      <span className="sv-magenta">SECURE</span></div>
        <div className="cyber-line cyber-line-output">  LOCATION <span className="sv-amber">HELSINKI</span></div>
      </div>
    </div>
  );
}

// ── Projects Pane ──
function ProjectsPane() {
  const [repos, setRepos] = useState<{ name: string; language: string | null; updated: string }[]>([]);

  useEffect(() => {
    fetch("https://api.github.com/users/psandis/repos?sort=updated&per_page=8")
      .then((r) => r.json())
      .then((data) => {
        setRepos(data.map((r: { name: string; language: string | null; pushed_at: string }) => ({
          name: r.name,
          language: r.language,
          updated: new Date(r.pushed_at).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="tmux-pane tmux-pane-projects">
      <div className="pane-header">── projects ──</div>
      <div className="pane-content">
        {repos.length === 0 && <div className="cyber-line cyber-line-output">  Loading...</div>}
        {repos.map((r) => (
          <div key={r.name} className="cyber-line cyber-line-output">
            {"  "}{r.name.slice(0, 18).padEnd(18)} <span className="sv-cyan">{(r.language || "").padEnd(10)}</span> <span className="sv-amber">{r.updated}</span>
          </div>
        ))}
        {repos.length > 0 && (
          <>
            <div className="cyber-line cyber-line-output"> </div>
            <div className="cyber-line cyber-line-output">  <span className="sv-green">{repos.length} repos shown</span></div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Terminal ──
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
  const [tmuxMode, setTmuxMode] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const size = tmuxMode ? { w: 900, h: 520 } : { w: 640, h: 420 };
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
  }, [windowState, tmuxMode]);

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

    if (trimmed === "resume") {
      window.open("https://drive.google.com/file/d/1KTgym750rA4502tvToMC2Z95BuEk9vf1/view?usp=drive_link", "_blank");
      newLines.push({ type: "output", text: "Opening resume..." });
      newLines.push({ type: "output", text: "" });
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (trimmed.startsWith("open ")) {
      const target = trimmed.slice(5).trim();
      const urls: Record<string, string> = {
        github: "https://github.com/psandis",
        linkedin: "https://www.linkedin.com/in/petrisandholm/",
        resume: "https://drive.google.com/file/d/1KTgym750rA4502tvToMC2Z95BuEk9vf1/view?usp=drive_link",
      };
      if (urls[target]) {
        window.open(urls[target], "_blank");
        newLines.push({ type: "output", text: `Opening ${target}...` });
      } else {
        newLines.push({ type: "error", text: `open: unknown target '${target}'` });
        newLines.push({ type: "output", text: "  Usage: open github | open linkedin | open resume" });
      }
      newLines.push({ type: "output", text: "" });
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (trimmed === "tmux") {
      setTmuxMode(true);
      newLines.push({ type: "output", text: "[tmux] session started" });
      newLines.push({ type: "output", text: "" });
      setLines((prev) => [...prev, ...newLines]);
      return;
    }

    if (trimmed === "exit" || trimmed === "quit") {
      if (tmuxMode) {
        setTmuxMode(false);
        newLines.push({ type: "output", text: "[tmux] session closed" });
        newLines.push({ type: "output", text: "" });
        setLines((prev) => [...prev, ...newLines]);
        return;
      }
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
  }, [onClose, tmuxMode]);

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

      {tmuxMode ? (
        <>
          {/* tmux pane layout */}
          <div className="tmux-layout">
            <div className="tmux-pane tmux-pane-main">
              <div className="pane-header">── bash ──</div>
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
            </div>
            <div className="tmux-right-col">
              <SystemPane cpu={cpu} ramUsed={ramUsed} ramTotal={ramTotal} clock={clock} />
              <ProjectsPane />
            </div>
          </div>
          {/* tmux status bar */}
          <div className="tmux-statusbar">
            <div className="tmux-statusbar-left">
              <span className="tmux-session">[ps-terminal]</span>
              <span>0:bash*</span>
              <span>1:system</span>
              <span>2:projects</span>
            </div>
            <div className="tmux-statusbar-right">
              <span>visitor@ps</span>
              <span>{clock}</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Normal terminal */}
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
          {/* Normal status bar */}
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
        </>
      )}
    </div>
  );
}
