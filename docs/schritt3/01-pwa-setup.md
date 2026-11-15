# PWA-Setup: Manifest & Service-Worker-Registrierung

## Tooling und Registrierung
Wir nutzen `vite-plugin-pwa` (Workbox, `generateSW`). Es fügt sich in die `vite-ssg`-Pipeline ein und erzeugt nach dem Prerendering die Precache-Liste aller statischen Assets. Registriert wird der Service Worker in `src/main.ts` über `virtual:pwa-register`: nur im Browser (`import.meta.env.SSR`-Prüfung), nach `router.isReady()` und mit `registerType: 'autoUpdate'`.

## Manifest-Werte
Das Manifest wird beim Build aus `vite.config.ts` als `manifest.webmanifest` erzeugt und übernimmt das Branding aus Schritt 1:
- **`name` / `short_name`:** `"GameFoundry — Forge Your Schedule"` bzw. `"GameFoundry"`
- **`start_url` & `scope`:** `"/"`
- **`display`:** `"standalone"`
- **`icons`:** 64, 192 und 512 px sowie 512 px `maskable` (`public/icons/`)

## Begründung der Farb- und Icon-Werte
`background_color` (`#08131C`, `--color-bg`) und `theme_color` (`#10222E`, `--color-surface-alt`) liest der Build direkt aus `tokens.css`. Die dunklen Oberflächentöne verhindern ein helles Aufblitzen beim Start und passen zum Dark-Mode-Standard; die Icons setzen mit `#18D7E8` (`--cyan-500`) den Markenakzent.
