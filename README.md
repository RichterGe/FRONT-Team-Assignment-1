# GameFoundry

Next Generation Web Frontends Team Assignment 
by Georg Richter & Eric Drößiger

## Development Setup

### Step 1

```sh
npm install
```

### Step 2

```sh
npm run dev
```

### Step 3

```sh
Open the local address printed by Vite Preview to inspect the project.
```


## Production Build

### Step 1

```sh
npm run build
```

### Step 2

```sh
npm run preview
```

### Step 3
```sh
Open the local address printed by Vite Preview to inspect the production build.
```


## Rendering

- **Speaker Profiles (`/speakers/:id`) — SSG:** Pre-rendered at build time with `vite-ssg`.
- **Session Overview (`/`) — SSG + CSR Filtering:** All 20 sessions are statically pre-rendered at build time; filter controls remain disabled until hydration completes, after which filtering by track, conference day, and level (with URL query sync) runs client-side.
- **Session Details (`/sessions/:id`) — SSG + CSR Revalidation (Stale-While-Revalidate):** Pre-rendered at build time for immediate display and SEO, then revalidated client-side via `useConferenceData().loadData()` fetching `/conference-data.json` after hydration so schedule or room updates take effect immediately.
- **My Programme (`/my-programme`) — CSR:** Rendered purely on the client by rehydrating bookmarked session IDs from `localStorage` and matching them against `useConferenceData()`.

`npm run build` runs the TypeScript/Vue type check and generates the production site in `dist/`. `npm run build-only` runs static generation without the type check.