# Scraper SOP (Standard Operating Procedure)

## Goal
Fetch and parse content from external sources into the defined `articles` schema.

## Sources & Logic

### 1. Generic Scraper (Fallback/Base)
- **Library**: `requests` + `BeautifulSoup`.
- **User-Agent**: Use a real browser user agent string.
- **Timeout**: 15 seconds.

### 2. Specific Parsers
#### Ben's Bites (Newsletter/Site)
- Target: `https://bensbites.co/` (or archive page).
- Selector (Title): `h2` or equivalent article link.
- Selector (Link): `a` href.
- Selector (Date): Meta tag or inferred from "Today".

#### AI Rundown
- Target: `https://www.therundown.ai/` (Archives).
- Logic: Identify latest post container.

#### Reddit (r/LocalLLaMA or r/ArtificialInteligence)
- Target: `https://www.reddit.com/r/ArtificialInteligence/top/?t=day`
- Note: Reddit API is strict. Use `.json` suffix trick or reliable HTML parsing if possible, but be gentle.
- Fallback: Skip if heavily rate-limited (429).

## Data Normalization
- **Title**: Clean whitespace.
- **URL**: Ensure absolute URL.
- **Published At**: Convert to UTC ISO format. If missing, use `now()`.
- **Source**: string key (`bens_bites`, `reddit`, etc.).

## Reliability Rules
- If a source fails, log error and continue to next source.
- Do NOT fail the entire batch.
- Return list of valid article objects.
