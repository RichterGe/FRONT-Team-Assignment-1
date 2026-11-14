# Konzept: Offline- und Caching-Strategie (GameFoundry)

## Reale Nutzungssituation auf der Konferenz
Während der **GameFoundry**-Konferenz wechseln Besuchende kontinuierlich zwischen Vortragssälen, Untergeschossen und Foyers. Das Konferenz-WLAN ist durch hunderte gleichzeitige Verbindungen regelmäßig überlastet; zudem schalten viele Teilnehmende ihr Smartphone während eines Vortrags in den Flugmodus, um Akku zu sparen, und prüfen in der kurzen Pause zwischen zwei Sessions ihren nächsten Raum. Die Plattform muss daher nach dem erstmaligen Online-Laden auch bei instabilem Empfang oder vollständigem Verbindungsabbruch verlässlich funktionieren.

## Caching-Strategien je Datentyp im Vergleich

| Datentyp | Enthaltene Ressourcen | Gewählte Strategie | Primäres Schutzziel |
|---|---|---|---|
| **1. Statische Assets & App-Shell** | HTML-Shell, JS-/CSS-Bundles, `tokens.css`, Icons, Fonts | **Cache-First** (Workbox Pre-Caching) | Sofortiger Start ohne Netz; Erreichbarkeit aller Routen |
| **2. Sessions- & Speaker-Daten** | `/conference-data.json` sowie vorgerenderte Detailseiten | **Stale-While-Revalidate** (Runtime-Cache + Build-Fallback) | Verzögerungsfreie Anzeige + Hintergrund-Update bei Raumwechsel |
| **3. „Mein Programm“** | Gespeicherte Session-IDs + App-Shell + Konferenzdaten | **`localStorage`** + **Cache-First App-Shell** (`navigateFallback`) | Offline-Lese- und Schreibzugriff auf den persönlichen Zeitplan |

### 1. Statische Assets & App-Shell — *Cache-First (Pre-Caching)*
Das Grundgerüst der Anwendung (HTML-Einstiegsseiten, kompilierte Vue-3-Chunks, `tokens.css`, Icons und Schriften) ändert sich ausschließlich bei einem neuen Release. Diese Dateien werden bei der Installation des Service Workers in den Pre-Cache geladen und per **Cache-First** direkt vom Gerät ausgeliefert. Im überfüllten Vortragssaal öffnet die Oberfläche damit verzögerungsfrei ohne Netzwerk-Latenz.

### 2. Sessions- und Speaker-Daten (`conference-data.json`) — *Cache-First vs. Stale-While-Revalidate*
Für die Konferenzdaten stehen zwei Strategien im direkten Vergleich:
- **Warum Cache-First für weitgehend statische Programmdaten naheliegt:** Nach der Programmveröffentlichung bleiben Speaker-Biografien, Abstracts und Track-Zuordnungen im Regelfall unverändert. Eine reine *Cache-First*-Strategie spart Datenvolumen und liefert das Programm im Flugmodus sofort aus dem lokalen Speicher.
- **Unter welcher Bedingung Stale-While-Revalidate nötig ist:** Im laufenden Konferenzbetrieb kommt es erfahrungsgemäß zu kurzfristigen Raumänderungen oder verschobenen Startzeiten. Konsistent mit unserer Rendering-Entscheidung aus Schritt 2 (ADR-0005) setzen wir für `/conference-data.json` daher **Stale-While-Revalidate** ein: Der Service Worker beantwortet Anfragen von `useConferenceData()` sofort aus dem Cache (kein Ladebalken bei schwachem Saal-WLAN), lädt jedoch im Hintergrund die aktuelle JSON-Datei vom Server nach und aktualisiert den Cache für den nächsten Aufruf.

### 3. „Mein Programm“ — *Client-Side Persistence (`localStorage`) + erreichbare App-Shell*
Die persönlichen Favoriten (`gamefoundry_my_programme`) werden bereits als ID-Array im `localStorage` gespeichert. Diese Persistenz allein genügt offline jedoch nicht: Wird `/my-programme` im Flugmodus neu geladen oder über das Homescreen-Icon gestartet, muss die App-Shell ohne Server erreichbar sein. Erst weil der Service Worker die App-Shell per **Cache-First** (inklusive `navigateFallback` auf `index.html` für die rein clientseitig gerenderte Route) sowie die gecachte `conference-data.json` bereitstellt, kann `usePersonalProgramme()` die gespeicherten IDs auch komplett offline zu vollständigen Session-Karten zusammensetzen.

## Verhalten im schlimmsten Fall (Kompletter Verbindungsabbruch mitten in der Nutzung)
Reißt die Verbindung mitten im Seitenwechsel oder während eines laufenden Revalidierungs-Requests vollständig ab, fängt der Service Worker den Netzwerkfehler ab und liefert den zuletzt gecachten Stand aus. Selbst wenn ein Hintergrund-Fetch in `useConferenceData()` fehlschlägt, verwirft das Composable die vorhandenen Daten nicht, sondern behält den im Bundle bzw. Cache hinterlegten Datensatz bei. Nutzende sehen zu keinem Zeitpunkt eine Browser-Fehlerseite und können Sessions weiterhin im `localStorage` vormerken oder entfernen.
