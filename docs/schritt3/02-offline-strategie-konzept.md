# Konzept: Offline- und Caching-Strategie (GameFoundry)

## Reale Nutzungssituation auf der Konferenz
Während der **GameFoundry**-Konferenz wechseln Besuchende ständig zwischen Vortragssälen, Untergeschossen und Foyers. Das Konferenz-WLAN ist durch hunderte Geräte regelmäßig überlastet; viele Teilnehmende aktivieren während eines Vortrags den Flugmodus und prüfen zwischen zwei Sessions ihren nächsten Raum. Nach einmaligem Online-Laden muss die Plattform daher auch bei schlechtem Empfang oder komplettem Netzabbruch zuverlässig funktionieren.

## Caching-Strategien je Datentyp im Vergleich

| Datentyp | Enthaltene Ressourcen | Gewählte Strategie | Primäres Schutzziel |
|---|---|---|---|
| **1. Statische Assets & App-Shell** | HTML-Shell & vorgerenderte SSG-Seiten, JS-/CSS-Bundles, `tokens.css`, Icons | **Cache-First** (Workbox Pre-Caching) | Sofortiger Start ohne Netz; Erreichbarkeit aller Routen |
| **2. Sessions- & Speaker-Daten** | `/conference-data.json` (Laufzeitdaten für `useConferenceData()`) | **Stale-While-Revalidate** (Runtime-Cache + Build-Fallback) | Sofortige Anzeige + Hintergrund-Update bei Raumwechsel |
| **3. „Mein Programm“** | Gespeicherte Session-IDs + App-Shell + Konferenzdaten | **`localStorage`** + **Cache-First App-Shell** (`navigateFallback`) | Offline-Lese- und Schreibzugriff auf den persönlichen Zeitplan |

### 1. Statische Assets & App-Shell — *Cache-First (Pre-Caching)*
Das Anwendungsgerüst (HTML-Shell, vorgerenderte Session-/Speaker-Seiten, Vue-3-Chunks, `tokens.css`, Icons) ändert sich nur bei einem neuen Deployment. Bei der Service-Worker-Installation landen diese Dateien im Pre-Cache und werden per **Cache-First** direkt vom Gerät ausgeliefert — im überfüllten Vortragssaal ohne jede Netzlatenz.

### 2. Sessions- und Speaker-Daten (`conference-data.json`) — *Cache-First vs. Stale-While-Revalidate*
- **Warum Cache-First für weitgehend statische Programmdaten naheliegt:** Nach Veröffentlichung bleiben Speaker-Biografien, Abstracts und Tracks meist konstant. *Cache-First* spart Datenvolumen und liefert das Programm im Flugmodus sofort lokal aus.
- **Wann Stale-While-Revalidate nötig ist:** Bei späten Raumänderungen oder verschobenen Startzeiten würde reines *Cache-First* veraltete Daten einfrieren. Konsistent mit ADR-0005 setzen wir für `/conference-data.json` daher **Stale-While-Revalidate** ein: Der Service Worker antwortet sofort aus dem Cache ohne Ladebalken, lädt bei vorhandener Verbindung aber parallel die aktuelle JSON-Datei für Folgeaufrufe nach.

### 3. „Mein Programm“ — *`localStorage` + erreichbare App-Shell*
Die Favoriten-IDs (`gamefoundry_my_programme`) liegen bereits im `localStorage`. Offline genügt das allein jedoch nicht: Wird `/my-programme` im Flugmodus neu geladen oder vom Homescreen geöffnet, muss zuerst die App-Shell laden. Erst durch **Cache-First** auf die App-Shell (inklusive `navigateFallback` auf `index.html` für die CSR-Route) und die gecachte `conference-data.json` setzt `usePersonalProgramme()` den Zeitplan komplett offline zusammen.

## Verhalten im schlimmsten Fall (Verbindungsabbruch mitten in der Nutzung)
Reißt das Netz während eines Seitenwechsels oder einer Hintergrund-Revalidierung ab, fängt der Service Worker den Fehler ab und liefert den letzten Cache-Stand. Schlägt der Fetch in `useConferenceData()` fehl, behält das Composable den vorhandenen bzw. eingebetteten Datensatz bei. Nutzende sehen keine Browser-Fehlerseite und können Sessions weiterhin lokal vormerken oder entfernen.
