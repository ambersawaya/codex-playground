# codex-playground

This project hosts the plant care confidence dashboard prototype.

## Live preview

Because the dashboard is a single static HTML page you only need a basic HTTP
server to view it locally. The simplest option is the Python standard library
server:

```bash
python3 -m http.server 8000
```

That command serves the repository contents from the current directory. Once
it is running, open your browser to <http://localhost:8000/index.html>.

If you prefer to avoid Python, any static file server works (for example
`npx serve .` or the Live Server extension in VS Code). Just make sure the
server's working directory is the repository root so that the relative asset
paths resolve correctly.
