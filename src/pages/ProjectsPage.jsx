import { useEffect, useMemo, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const formatDate = (value) => {
  if (!value) return 'Updated —';
  return `Updated ${new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))}`;
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('https://api.github.com/users/psandis/repos?sort=updated&per_page=100');
        if (!res.ok) throw new Error('Unable to fetch repositories');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const languages = useMemo(() => {
    const known = projects.map((p) => p.language || 'Other');
    const set = new Set(known);
    const extras = ['Salesforce', 'Scripts'];
    extras.forEach((item) => set.add(item));
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const filtered = useMemo(() => {
    if (languageFilter === 'All') return projects;
    return projects.filter((p) => (p.language || 'Other') === languageFilter);
  }, [projects, languageFilter]);

  return (
    <>
      <header className="header-row">
        <div>
          <ul className="menu">
            {languages.map((lang) => (
              <li key={lang}>
                <button
                  className={`menu__link${lang === languageFilter ? ' active' : ''}`}
                  onClick={() => setLanguageFilter(lang)}
                  aria-pressed={lang === languageFilter}
                >
                  {lang}
                </button>
              </li>
            ))}
          </ul>
          <h1 className="heading">GitHub project cards</h1>
          <p className="subhead">Live data from psandis — title, description, and last update. Filters by language.</p>
        </div>
        <Link className="about-btn" to="/about">
          About Author
        </Link>
      </header>

      {loading && (
        <div className="status status--loading" role="status">
          <span className="spinner" aria-hidden="true" />
          <span>Loading projects…</span>
        </div>
      )}

      {error && (
        <div className="status status--error">
          <span>Failed to load projects. {error}</span>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="status">No projects found for "{languageFilter}".</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <section className="grid">
          {filtered.map((project, idx) => {
            const variants = ['variant-lime', 'variant-grape', 'variant-grapefruit'];
            const variant = variants[idx % variants.length];
            return (
              <article key={project.id} className={`card ${variant}`}>
                <div className="card__header">
                  <FaGithub className="card__icon" aria-hidden="true" />
                  <a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card__title"
                    title={project.name}
                  >
                    {project.name}
                  </a>
                </div>
                <p className="card__body">
                  {project.description || 'No description provided.'}
                </p>
                <p className="card__footer">{formatDate(project.pushed_at)}</p>
                <div className="card__cta">
                  <a
                    className="card__link"
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
};

export default ProjectsPage;
