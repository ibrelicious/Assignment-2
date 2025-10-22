# Assignment 2 — NASA API

This project fulfills the assignment using **NASA’s Mars Rover Photos** API from `https://api.nasa.gov/`.

## How to run

1. Open `index.html` in a browser (or use WebStorm’s built-in server).
2. Open the **console** in DevTools — all required outputs are printed there.

> If you hit rate limits on the NASA **DEMO_KEY**, request your own free key at the NASA API portal and set it in `app.js`.

## What the code does (flow)

- **Fetch + async/await**: Grabs JSON from `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=...`.
- **Normalize** the raw JSON into flat objects for easier processing.
- Uses these **array methods**:
    - `map` — normalize data and to build compact summaries,
    - `filter` — select photos matching a given camera category,
    - `reduce` — build frequency objects (counts per camera),
    - `flatMap` — flatten camera names across photos,
    - `some` / `every` — quick data checks,
    - `sort` — alphabetical titles and top frequencies,
    - `slice` — show “first 5”.
- **Prints**:
    - First **5** camera names (alphabetical).
    - All photos for a **given category** (camera full name) printing: `name — category`.
    - A **count object** of how many photos per category (camera).
- **Stretch (VG)**:
    - `groupBy(items, keyOrFn)` — group by camera or sol.
    - **Select & reshape** — compact summaries: `{ id, name, category, date, image, cameras }`.
    - **Frequency map** — how often each camera appears (via `flatMap` + `reduce`).
