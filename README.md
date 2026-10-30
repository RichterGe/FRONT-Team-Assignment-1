# GameFoundry

Next Generation Web Frontends Team Assignment 
by Georg Richter & Eric Drößiger

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
- Firefox:


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

The session overview and all 18 speaker profile routes are statically generated during the production build with `vite-ssg`. Vue hydrates these pages in the browser; session filters then run client-side and combine Track, conference day, and level. The personal programme remains client-rendered because it depends on browser-local storage.

`npm run build` runs the TypeScript/Vue type check and generates the production site in `dist/`. `npm run build-only` runs static generation without the type check. Session detail routes are not currently included in the static route list.