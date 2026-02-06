# Database SOP (Standard Operating Procedure)

## Goal
Manage all interactions with the Supabase `articles` table deterministically.

## Schema
Refer to `gemini.md` for the single source of truth.

## Operations

### 1. Upsert Article
- **Input**: Dictionary matching `articles` schema.
- **Logic**:
  - Use `url` as the unique constraint for upsert.
  - If article exists, update `title`, `summary`, `published_at`, `scraped_at`.
  - Do NOT overwrite `is_saved` (it is a user state).
  - Return: The inserted/updated record.

### 2. Fetch Latest Articles
- **Input**: `limit` (int, default 50).
- **Logic**:
  - Select * from `articles`.
  - Order by `published_at` DESC.
  - Limit by input.

### 3. Toggle Save Status
- **Input**: `article_id` (uuid), `is_saved` (boolean).
- **Logic**:
  - Update `is_saved` field for the given ID.
  - Return: Success/Fail boolean.

## Error Handling
- Capture `postgrest.exceptions.APIError`.
- Log failures to stdout but do not crash the main process.
- Return `None` on read failure, `False` on write failure.
