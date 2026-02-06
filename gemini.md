# Project Gemini: Constitution & State

## 1. Data Schema (The "Payload")
> **Data-First Rule**: Coding only begins once the "Payload" shape is defined here.

### Raw Input (Scraper Yield)
```json
{
  "title": "string",
  "url": "string",
  "source": "string", // "bens_bites", "ai_rundown", "reddit"
  "published_at": "ISO8601 string",
  "summary": "string (optional)",
  "raw_html_content": "string (optional)"
}
```

### Processed Output (Supabase 'articles' table)
```json
{
  "id": "uuid (primary key)",
  "title": "string",
  "url": "string (unique constraint)",
  "source": "string",
  "published_at": "timestamptz",
  "summary": "text",
  "scraped_at": "timestamptz",
  "is_saved": "boolean (default false)",
  "user_id": "uuid (optional, for auth if needed later)"
}
```

## 2. Behavioral Rules
> How the system should "act".

1.  **Cadence**: Scrape sources every 24 hours.
2.  **Persistence**:
    -   Store all scraped articles in Supabase.
    -   Deduplicate articles based on URL.
    -   Persist "Saved" state (`is_saved`) across page reloads via Supabase updates.
    -   If no new articles are found, display existing ones from the database.
3.  **UI/UX**:
    -   **Style**: Premium, beautiful, interactive.
        -   **Tech**: Tailwind CSS.
        -   **Palette**: Dark Mode (`#000000`), Primary (`#BFF549` - Neon Lime), Text (`#FFFFFF`).
        -   **Typography**: `Inter` font family.
        -   **Components**: Pill-shaped buttons (`rounded-full`), Glassmorphism.
    -   **Interaction**: Users can "Save" articles.
    -   **Language**: Portuguese (PT-BR).
4.  **Error Handling**:
    -   If scraper fails, log error and show cached data from Supabase.
    -   Graceful degradation if external sources change structure.

## 3. Architectural Invariants
> Non-negotiable technical constraints.

- **Protocol**: B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger)
- **Architecture**: A.N.T. 3-Layer (Architecture, Navigation, Tools)
- **Reliability**: Deterministic logic over probabilistic guessing.
- **Tools**: Atomic, testable Python scripts in `tools/`.
- **State**: `gemini.md` is law.

## 4. Maintenance Log (The "Trigger" Phase)

### How to Run
1.  **Backend (Scheduler)**:
    ```bash
    python3 tools/scheduler.py
    ```
    *Keeps running and scrapes every 24h.*

2.  **Frontend (Dashboard)**:
    ```bash
    cd dashboard-agente
    npm run dev
    ```
    *Opens at http://localhost:5173*

### Troubleshooting
-   **Supabase Connection**: Check `.env` keys. Run `python3 tools/verify_supabase.py`.
-   **Scraper Fails**: Check `SCRAPER_SOP.md`. Verify source HTML structure hasn't changed.
-   **Frontend**: If generic error, check browser console and `VITE_SUPABASE_URL` in `dashboard-agente/.env`.

