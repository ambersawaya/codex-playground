# codex-playground

This project now hosts a small multi-page "Garden Insights" prototype. The landing page links to
dedicated concepts for score filtering and streaming visualizations while sharing a common theme
and component styling.

## Project structure

```
index.html                     # Landing hub with navigation cards
score-filters.html             # Original confidence dashboard, moved into its own page
streaming-visualization.html   # Concept layout for real-time telemetry visuals
assets/
  css/site.css                 # Shared palette, layout, and component styles
  js/score-filters.js          # Confidence filter logic + remote theme loader
```

## Live preview

All pages are static HTML documents, so you only need a lightweight HTTP server to browse them.
From the repository root run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/> to reach the landing page. The navigation pills link to each
concept page. Any other static file server (for example `npx serve .` or the VS Code Live Server
extension) works too—just be sure to serve the repository root so the shared CSS/JS assets resolve
correctly.
