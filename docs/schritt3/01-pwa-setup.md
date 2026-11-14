# PWA-Setup: Manifest & Service-Worker-Registrierung

## Tooling und Registrierung
Für den Ausbau von **GameFoundry** zur installierbaren PWA nutzen wir `vite-plugin-pwa` (Workbox). Das Plugin integriert sich direkt in unsere Vite- und `vite-ssg`-Pipeline, generiert beim Build automatisch das Pre-Cache-Manifest für alle statischen Assets und registriert den Service Worker über `registerType: 'autoUpdate'` ohne fehleranfällige manuelle Cache-Versionierung.

## Manifest-Werte
Das Web App Manifest (`manifest.webmanifest`) übernimmt die Branding-Definitionen aus Schritt 1:
- **`name` / `short_name`:** `"GameFoundry — Forge Your Schedule"` bzw. `"GameFoundry"`
- **`start_url` & `scope`:** `"/"`
- **`display`:** `"standalone"` für ein App-Erlebnis ohne Browser-Adressleiste
- **`icons`:** Bereitstellung in `192x192` und `512x512` Pixeln (`png`, inkl. `maskable`)

## Begründung der Farb- und Icon-Werte
Als `background_color` (`#08131C`, Token `--blue-950` / `--color-bg`) und `theme_color` (`#10222E`, Token `--blue-900` / `--color-surface-alt`) nutzen wir unsere dunklen Foundry-Oberflächentöne. Dies verhindert ein helles Aufblitzen beim App-Start und passt die Systemleiste dem Dark-Mode-Standard an, während die Icons mit `#18D7E8` (`--cyan-500`) unseren primären Markenakzent setzen.
