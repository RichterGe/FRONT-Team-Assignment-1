# ADR-0006: Entscheidungsprotokoll zu PWA-, Offline- und Caching-Strategien (inkl. Testszenarien)

## Status
Approved

## Datum
2026-11-14

## Autoren & Review
- **Federführend & Cross-Review im Wechsel:** Eric Drößiger (Person 1: App-Shell & Statische Assets) und Georg Richter (Person 2: Sessions-/Speaker-Daten-Caching & Verifikation)
- **Gemeinsame Bewertungsgrundlage mit Schritt 2:** Verbindet [ADR-0005: Rendering-Strategien der Anwendungsteile](../schritt2/01-rendering-strategie-adr.md) mit der Offline- und Service-Worker-Architektur aus Schritt 3.

---

## Zusammenspiel von Rendering-Strategie (Schritt 2) und Offline-Caching (Schritt 3)

In [ADR-0005](../schritt2/01-rendering-strategie-adr.md) haben wir für jeden Anwendungsteil eine spezifische Rendering-Strategie festgelegt:
1. **Speaker-Profile (`/speakers/:id`):** Statische Vorgenerierung (**SSG**) zur Build-Zeit.
2. **Session-Übersicht (`/`):** **SSG** für den sofortigen initialen Load, kombiniert mit clientseitiger Filterung (**CSR**) nach der Hydration.
3. **Session-Detailseiten (`/sessions/:id`):** **SSG** kombiniert mit einer clientseitigen Revalidierung (**CSR-Fetch** von `/conference-data.json`), um kurzfristige Raum- oder Zeitänderungen abzubilden.
4. **„Mein Programm“-Dashboard (`/my-programme`):** Reines **CSR**, da die gemerkten Session-IDs im browserspezifischen `localStorage` liegen.

Dieses Entscheidungsprotokoll erweitert ADR-0005 um die Service-Worker-Schicht (`vite-plugin-pwa` / Workbox), damit alle vier Anwendungsteile in der realen Konferenzumgebung (überlastetes Saal-WLAN, Funklöcher, Flugmodus zwischen Vorträgen) offlinefähig und installierbar sind.

---

## 1. App-Shell & Statische Assets (Federführend: Eric Drößiger / Review: Georg Richter)

### Kontext
Die App-Shell (`index.html`, vorgerenderte SSG-Dokumente, Header und Navigation in `App.vue`), die kompilierten JavaScript- und CSS-Bundles, die Design-Tokens (`tokens/tokens.css`) sowie die PWA-Icons bilden das visuelle und strukturelle Fundament der Plattform. Da diese Dateien durch Vite mit Content-Hashes im Dateinamen gebaut werden, ändern sie sich zwischen zwei Deployments nie. Ohne eine lokale Vorhaltung im Browser würde jeder Seitenaufruf oder Reload im Funkloch mit einer generischen Browser-Fehlerseite (`ERR_INTERNET_DISCONNECTED`) abbrechen – selbst dann, wenn Nutzende lediglich ihr im `localStorage` gespeichertes Programm einsehen möchten.

### Betrachtete Optionen
* **Network-First für Navigations- und Asset-Anfragen:** Der Browser versucht bei jedem Aufruf zuerst, HTML und Bundles vom Server zu laden, und fällt erst nach einem Timeout auf den Cache zurück. *Nachteil:* Bei instabilem Konferenz-WLAN („Lie-Fi“) blockiert ein hängender Request den Seitenaufbau über mehrere Sekunden.
* **Reines Runtime-Caching (Cache-First erst bei Bedarf):** Assets werden erst dann gecacht, wenn eine Route zum ersten Mal aktiv besucht wurde. *Nachteil:* Besucht eine Person online nur die Startseite und klickt später im Flugmodus erstmals auf „My Programme“ oder eine Detailseite, fehlt der zugehörige Lazy-Loaded-View-Chunk (`PersonalProgrammeView.js`, `SessionDetailView.js`).
* **Build-Time Pre-Caching mit Cache-First & Navigation-Fallback (Workbox `generateSW`):** Sämtliche beim Build erzeugten HTML-, JS-, CSS- und Icon-Dateien werden bei der Service-Worker-Installation vorab in den Pre-Cache geladen und fortan direkt aus dem Cache bedient; nicht vorgerenderte CSR-Routen wie `/my-programme` erhalten ein `navigateFallback` auf `index.html`.

### Entscheidung
Wir entscheiden uns für **Build-Time Pre-Caching in Kombination mit einer Cache-First-Strategie und `navigateFallback` auf `index.html`** über `vite-plugin-pwa`.

### Konsequenzen
* **Positiv:** Nach dem ersten Online-Aufruf der Plattform befinden sich alle View-Chunks (`ConferenceOverviewView`, `SessionDetailView`, `SpeakerDetailView`, `PersonalProgrammeView`), Stylesheets und Icons vollständig im lokalen Cache Storage. Seitenwechsel und Reloads im Flugmodus erfolgen ohne Netzwerk-Verzögerung.
* **Negativ:** Beim allerersten Besuch werden sämtliche App-Shell-Assets im Hintergrund vorab heruntergeladen, was das initiale Transfervolumen leicht erhöht (bei unserem schlanken Bundle-Umfang jedoch unter wenigen hundert Kilobyte).
* **Risiken:** Ein fehlerhaft konfiguriertes Pre-Cache-Glob-Pattern könnte Assets übersehen. Wir schließen deshalb explizit `**/*.{js,css,html,ico,png,svg,json,woff2}` in die Workbox-Konfiguration ein.

---

## 2. Sessions- und Speaker-Daten (`conference-data.json`) (Federführend: Georg Richter / Review: Eric Drößiger)

### Kontext
Das Composable `useConferenceData()` stellt die 20 Sessions, 18 Speaker, Tracks und Räume bereit. Gemäß ADR-0005 ist der initiale Zustand zwar bereits zur Build-Zeit in das Bundle eingebettet, beim Aufruf von `SessionDetailView` und `PersonalProgrammeView` führt `loadData()` jedoch zur Laufzeit einen `fetch('/conference-data.json')` aus, um späte Raum- oder Uhrzeitänderungen abzurufen. Auf der Konferenz muss dieser Abruf einerseits bei Verbindungsabbruch sofort funktionieren, darf andererseits aber Programm-Updates nicht dauerhaft durch veraltete Caches blockieren.

### Betrachtete Optionen
* **Cache-First (ohne Hintergrund-Revalidierung):** Sobald `/conference-data.json` einmal im Cache liegt, wird das Netzwerk bis zum Ablauf der Cache-Lebensdauer komplett ignoriert. *Vorteil:* Minimaler Datenverbrauch. *Nachteil:* Kurzfristige Raumänderungen während des Konferenztags kommen bei den Teilnehmenden nicht an, was der Entscheidung aus ADR-0005 widerspricht.
* **Network-First:** Der Service Worker versucht zuerst, `/conference-data.json` über das Konferenz-WLAN zu laden, und nutzt den Cache nur bei Fehlern. *Nachteil:* Bei überlastetem Saal-WLAN verzögert sich die Datenaktualisierung bis zum Netzwerk-Timeout.
* **Stale-While-Revalidate (SWR):** Der Service Worker liefert `/conference-data.json` sofort aus dem lokalen Cache (`conference-data-cache`) an die Anwendung zurück und aktualisiert den Cache-Eintrag parallel im Hintergrund über das Netzwerk, sofern eine Verbindung besteht.

### Entscheidung
Wir wählen **Stale-While-Revalidate** für die Route `/conference-data.json` (sowie das Pre-Caching des initialen Standes), abgesichert durch die fehlertolerante Fallback-Logik in `useConferenceData()`.

### Konsequenzen
* **Positiv:** Vollständige Konsistenz zwischen Schritt 2 (ADR-0005) und Schritt 3: Nutzende erhalten im Vortragssaal oder Flugmodus sofortige Antwortzeiten aus dem Cache (`from ServiceWorker`), während Raum- oder Zeitänderungen bei bestehender Verbindung automatisch im Hintergrund eingespielt werden. Schlägt der Hintergrund-Request im Offline-Modus fehl, behält `useConferenceData()` den gecachten bzw. statisch eingebetteten Datensatz ohne Fehlermeldung im UI bei.
* **Negativ:** Wird ein Raum auf dem Server geändert, sieht der Client beim unmittelbar ersten Aufruf nach der Änderung zunächst noch den gecachten Stand (`Stale`), bevor die Revalidierung im Hintergrund abgeschlossen ist.
* **Risiken:** Ohne Begrenzung könnten veraltete Einträge unbegrenzt im Cache verbleiben; wir begrenzen den Runtime-Cache daher über das Workbox-`ExpirationPlugin` (z. B. `maxEntries: 5`, `maxAgeSeconds: 86400`).

---

## 3. „Mein Programm“-Dashboard & Persistenz (Gemeinsam: Eric Drößiger & Georg Richter)

### Kontext
Das Feature „Mein Programm“ (`/my-programme`) speichert über `usePersonalProgramme()` ausschließlich die IDs der favorisierten Sessions unter dem Schlüssel `gamefoundry_my_programme` im `localStorage` und verknüpft diese über eine `computed`-Property mit den Session-Objekten aus `useConferenceData()`. Da `/my-programme` laut ADR-0005 rein clientseitig (CSR) gerendert wird und im SSG-Build (`vite.config.ts`) bewusst von der statischen HTML-Generierung ausgenommen ist, existiert auf dem Server keine eigene statische HTML-Datei für diesen Pfad.

### Betrachtete Optionen
* **Ausschließliche `localStorage`-Nutzung ohne Service-Worker-Navigation-Fallback:** Funktioniert nur, solange Nutzende die Seite niemals neu laden und nur innerhalb der bereits geöffneten Single-Page-Application navigieren. Ein Reload von `/my-programme` im Offline-Modus schlägt fehl.
* **Speicherung vollständiger Session-Objekte in `localStorage` oder `IndexedDB`:** Würde zwar die Abhängigkeit von `conference-data.json` reduzieren, führt aber laut unserem State-Management-Konzept aus Schritt 1 zu Dateninkonsistenzen (Stale Data bei Raumänderungen) und löst das Problem der fehlenden App-Shell beim Offline-Reload nicht.
* **Kombination aus `localStorage` (ID-Persistenz), Pre-Cached App-Shell (`navigateFallback: '/index.html'`) und gecachter `conference-data.json`:** Der Service Worker beantwortet direkte Navigationsanfragen auf `/my-programme` offline mit der gecachten `index.html`, woraufhin Vue Router die `PersonalProgrammeView` lädt, `usePersonalProgramme()` die IDs aus dem `localStorage` rehydriert und mit den gecachten Konferenzdaten abgleicht.

### Entscheidung
Wir behalten die **reine ID-Persistenz im `localStorage`** bei und sichern die Offline-Erreichbarkeit der CSR-Route `/my-programme` über das **Pre-Caching der App-Shell inklusive `navigateFallback` sowie die gecachte `conference-data.json`** ab.

### Konsequenzen
* **Positiv:** „Mein Programm“ ist auch nach einem kompletten Browser-Reload oder beim direkten Start über das PWA-Homescreen-Icon im Flugmodus uneingeschränkt nutzbar. Raumänderungen aus `conference-data.json` wirken sich sofort auch auf bereits gespeicherte Favoriten aus.
* **Negativ:** Die Funktionsfähigkeit hängt davon ab, dass die App mindestens einmal online geöffnet wurde, damit Service Worker, App-Shell und Basisdaten im Browser registriert sind.
* **Risiken:** Löscht der Nutzer manuell die gesamten Website-Daten im Browser, werden sowohl der Cache Storage als auch der `localStorage` geleert.

---

## 4. Konkret getestete Szenarien (Gemeinsames Testprotokoll)

Die folgenden drei Pflichtszenarien wurden nach dem Produktions-Build (`npm run build && npm run preview`) von beiden Teammitgliedern unabhängig auf dem jeweils eigenen System durchgeführt und im Cross-Review abgeglichen:
- **Testumgebung 1 (Eric Drößiger):** 
- **Testumgebung 2 (Georg Richter):** Windows 11, Mozilla Firefox

### Szenario 1: Programm einmal online geladen, Flugmodus aktiviert, Session-Übersicht erneut geöffnet
* **Ausgangslage:** Der Produktions-Build läuft lokal unter `http://localhost:4173`. Die Startseite (`/`) mit der Session-Übersicht wurde einmalig bei aktiver Verbindung im Browser geladen. Im DevTools-Tab *Application → Service Workers* ist der Service Worker (`sw.js`) im Status *activated and is running* sichtbar; der Pre-Cache enthält alle HTML-, JS-, CSS- und JSON-Ressourcen.

### Szenario 2 „Mein Programm“ offline geöffnet, nachdem zuvor Sessions hinzugefügt wurden
* **Ausgangslage:** Die Anwendung wurde zuvor online geladen. Auf der Übersichtsseite und einer Detailseite wurden drei Sessions (z. B. `session-1`, `session-5`, `session-12`) per Klick auf *Add to Programme* vorgemerkt. Im Header-Badge wird der Zähler `3` angezeigt, und im `localStorage` ist unter `gamefoundry_my_programme` das JSON-Array `["session-1","session-5","session-12"]` persistiert.

### Szenario 3: Erstbesuch ohne vorheriges Online-Laden im Offline-Zustand (Bewusster Grenzfall)
* **Ausgangslage:** Es wird ein frisches Browser-Profil (Inkognito-Fenster bzw. nach vollständigem Leeren von Cache Storage, Service Worker und `localStorage` über *Application → Clear storage*) verwendet. Die Anwendung wurde in diesem Browser-Kontext noch **nie** zuvor online geöffnet; es ist folglich kein Service Worker registriert und kein lokaler Cache vorhanden. Bereits vor dem ersten Seitenaufruf wird der **Offline**-Modus aktiviert.
