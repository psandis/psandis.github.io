# psandis.github.io

[![Deploy](https://img.shields.io/github/deployments/psandis/psandis.github.io/github-pages?label=deploy&style=flat-square)](https://psandis.github.io)
[![Version](https://img.shields.io/badge/version-1.0.1-blue?style=flat-square)](https://github.com/psandis/psandis.github.io/releases)

Personal portfolio site for Petri Sandholm, engineering leader with 20+ years of experience in telecom, banking, and large-scale platforms.

<p align="center">
  <img src="public/projects/psandis.github.io.png" alt="psandis.github.io" width="600">
</p>

## What It Is

An interactive 3D portfolio built with React Three Fiber. Projects are fetched live from the GitHub API and displayed as cards in a rotating 3D carousel. Clicking a card opens a detail modal. A cyberpunk-styled terminal is accessible from the header.

## Tech Stack

- React 18 + TypeScript
- Vite
- Three.js / React Three Fiber + Drei (3D carousel)
- Framer Motion (animations)
- Tailwind CSS
- Lucide React (icons)
- GitHub API (live project data)

## Features

- Interactive 3D project carousel with auto-rotation, drag, and scroll
- Project screenshots on cards with back-of-card mirror reflection
- Language icon fallback for projects without screenshots
- Project detail modal with thumbnail, tech stack, and links
- Cyberpunk terminal with commands: `about`, `projects`, `skills`, `contact`, `tmux`
- tmux-style split pane mode with live system stats and project feed
- Responsive header with hamburger menu on mobile
- Animated entrance overlay, background marquee, and floating header
- Nordic Frost color theme

## File Structure

```
psandis.github.io/
├── public/
│   ├── favicon.png
│   ├── ps-logo.png
│   ├── icons/               Language fallback icons (java, javascript, python, typescript)
│   └── projects/            Project screenshot thumbnails
├── src/
│   ├── components/
│   │   ├── CarouselScene.tsx    3D carousel with cards
│   │   ├── FloatingHeader.tsx   Top navigation
│   │   ├── ProjectModal.tsx     Project detail popup
│   │   ├── BackgroundMarquee.tsx
│   │   ├── EntranceOverlay.tsx
│   │   ├── Footer.tsx
│   │   └── terminal/
│   │       ├── Terminal.tsx     Interactive terminal emulator
│   │       └── TerminalModal.tsx
│   ├── pages/
│   │   └── Index.tsx            Main page, fetches GitHub repos
│   ├── types.ts
│   └── index.css
├── .github/workflows/
│   └── deploy.yml               GitHub Pages deployment
└── index.html
```

## Deployment

Deployed automatically to GitHub Pages on every push to `main`.

```
https://psandis.github.io
```

Workflow: `.github/workflows/deploy.yml` builds with Vite and deploys using `actions/deploy-pages`.

## Development

Requirements: Node 20+, npm

```bash
git clone https://github.com/psandis/psandis.github.io.git
cd psandis.github.io
npm install
npm run dev
```

Build:

```bash
npm run build
```

## License

See [MIT](LICENSE)
