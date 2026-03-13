export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  has_pages: boolean;
  pushed_at: string;
  topics: string[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  homepage: string | null;
  color: string;
  updatedAt: string;
}
