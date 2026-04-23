import { useEffect, useState } from "react";
import CarouselScene from "@/components/CarouselScene";
import EntranceOverlay from "@/components/EntranceOverlay";
import FloatingHeader from "@/components/FloatingHeader";
import ProjectModal from "@/components/ProjectModal";
import BackgroundMarquee from "@/components/BackgroundMarquee";
import Footer from "@/components/Footer";
import TerminalModal from "@/components/terminal/TerminalModal";
import { GitHubRepo, Project } from "@/types";

function getAccentColors(): string[] {
  const style = getComputedStyle(document.documentElement);
  return Array.from({ length: 8 }, (_, i) =>
    style.getPropertyValue(`--accent-${i + 1}`).trim() || "#7BA3B8"
  );
}

function repoToProject(repo: GitHubRepo): Project {
  const tech: string[] = [];
  if (repo.language) tech.push(repo.language);
  if (repo.topics) {
    repo.topics.slice(0, 5).forEach((t) => {
      if (t.toLowerCase() !== (repo.language || "").toLowerCase()) {
        tech.push(t);
      }
    });
  }

  return {
    id: repo.id,
    title: repo.name,
    description: repo.description || "No description provided.",
    tech: tech.length > 0 ? tech : ["Code"],
    github: repo.html_url,
    homepage: repo.homepage || (repo.has_pages ? `https://psandis.github.io/${repo.name}/` : null),
    color: "", // filled after mount from CSS vars
    updatedAt: repo.pushed_at,
  };
}

export default function Index() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://api.github.com/users/psandis/repos?sort=updated&per_page=100"
        );
        if (!res.ok) throw new Error("Unable to fetch repositories");
        const data: GitHubRepo[] = await res.json();
        const repos = Array.isArray(data) ? data : [];
        const colors = getAccentColors();
        setProjects(repos.map((r, i) => ({
          ...repoToProject(r),
          color: colors[i % colors.length],
        })));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <BackgroundMarquee />
      <EntranceOverlay />
      <FloatingHeader onTerminalOpen={() => setTerminalOpen(true)} />

      {loading && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="font-body text-muted-foreground text-sm animate-pulse">
            Loading projects…
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="font-body text-red-400 text-sm">
            Failed to load projects. {error}
          </div>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <CarouselScene projects={projects} selectedProjectId={selectedProject?.id ?? null} onSelectProject={setSelectedProject} />
      )}

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <TerminalModal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <Footer />
    </>
  );
}
