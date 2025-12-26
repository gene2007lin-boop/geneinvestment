Smart Notes — Demo

This folder contains a self-contained demo of the "Smart Notes" project linked from the main portfolio.

Features
- Offline-first notes stored in IndexedDB
- Tags and quick filtering
- Simple client-side summary (first N words)
- Export all notes to a Markdown file
- Open and delete individual notes

Files
- `index.html` — demo UI (uses site CSS)
- `app.js` — client-side logic (IndexedDB helpers, render, export)

How to run locally
1. Start a simple static server from the repo root (Python example):

```bash
python -m http.server 8000
```

2. Open http://localhost:8000/projects/smart-notes/

Notes on production
- This demo is purely client-side; no backend required.
- The code uses IndexedDB — data is stored in the browser.
- For a production app, consider adding input sanitization, sync to remote storage, and richer summarization (server-side or LLM integration).
