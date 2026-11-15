# ADR-0005: Rendering-Strategien der Anwendungsteile

## Status
Approved

## Datum
2026-10-30

## Einleitung
In diesem Decision Record legen wir die spezifischen Rendering-Strategien (CSR, SSR, SSG oder ISR) für die vier Kernbereiche der GameFoundry-Konferenzplattform fest. Anstatt einen pauschalen Default-Wert für das gesamte Projekt zu übernehmen, evaluieren wir jeden Anwendungsteil separat. 

Die Wahl der passenden Strategie hängt maßgeblich von 
den tatsächlichen Dateneigenschaften ab: 
- Ändern sich die Inhalte selten oder häufig? 
- Sind sie für alle Besucher identisch oder nutzerspezifisch personalisiert? 

Wir bewerten jeden Bereich individuell, um das optimale 
Gleichgewicht zwischen initialer Ladezeit (Performance), Suchmaschinenoptimierung (SEO) und der Aktualität der 
angezeigten Informationen zu finden. Dabei wird auch das vermittelte Konzept der Hydration und deren Auswirkungen berücksichtigt.

---

## 1. Speaker-Profile (Federführend: Eric Drößiger / Review: Georg Richter)

### Kontext
Die Profilseiten der Speaker (Route z.B. `/speakers/[id]`) enthalten biografische Daten, Titel, 
Firmenzugehörigkeiten sowie eine Liste der von ihnen gehaltenen Sessions. Sobald das Konferenzprogramm 
veröffentlicht ist, sind diese Daten als statisch zu betrachten. Änderungen an der Biografie oder 
dem Namen einer Person zur Laufzeit der Konferenz kommen in der Praxis so gut wie nicht vor. 
Gleichzeitig sollen Speaker-Profile für Marketingzwecke gut über Suchmaschinen auffindbar sein, was schnelles Rendering und vollständiges HTML erfordert.

### Betrachtete Optionen
*   **SSG (Static Site Generation):** Das HTML wird einmalig zur Build-Zeit vom Server vorgerendert.
*   **SSR (Server-Side Rendering):** Das HTML wird bei jedem Seitenaufruf neu auf dem Server berechnet.
*   **CSR (Client-Side Rendering):** Das HTML wird erst im Browser vom JavaScript generiert.

### Entscheidung
Wir werden **SSG (Static Site Generation)** für die Speaker-Profile verwenden.

### Konsequenzen
*   **Positiv:** Da der Server die schwere Arbeit bereits im Voraus erledigt, wird das HTML sofort ausgeliefert. 
Der Nutzer sieht das Profil praktisch verzögerungsfrei. Suchmaschinen und Social-Media-Scraper können 
Vorschaubilder und Biografien problemlos auslesen, da sie nicht auf die Ausführung von JavaScript angewiesen sind.
*   **Negativ:** Sollte sich wider Erwarten doch ein Tippfehler in einer Biografie befinden, muss ein kompletter, neuer Build-Prozess angestoßen und deployed werden, um die Änderung sichtbar zu machen.
*   **Risiken:** Bei einer Konferenz mit hunderten Speakern könnte die Build-Zeit anwachsen.

---

## 2. Session-Übersicht mit Filterung (Federführend: Eric Drößiger / Review: Georg Richter)

### Kontext
Die Übersichtsseite zeigt 20 Sessions und filtert nach Track, Tag und Level (UND-Verknüpfung). Die Daten kommen aus `useConferenceData()`. Als Haupteinstieg sind kurze Ladezeit und SEO wichtig; Filter sollen nach einem Klick ohne Unterbrechung reagieren.

### Betrachtete Optionen
*   **Reines SSR (Server-Side Rendering):** Die Seite und jeder Filter-Status wird vom Server generiert.
*   **Reines CSR (Client-Side Rendering):** Der Client lädt ein leeres Div und baut die 20 Sessions erst auf, wenn das JavaScript geladen ist. SEO wird erschwert.
*   **Hybrides Rendering (SSG mit anschließender CSR-Hydration):** Die ungefilterte Liste aller 20 Sessions wird statisch ausgeliefert; nach der Hydration wird die Filterung rein im Client berechnet.

### Entscheidung
Wir entscheiden uns für den hybriden Ansatz: 
**SSG für den initialen Load, danach vollständige Client-Side Filterung (CSR)**.

### Konsequenzen
*   **Positiv:** Vollständiges HTML liefert die Übersicht sofort aus. Nach der Hydration filtert der Browser die 20 Sessions schneller als ein Server-Request.
*   **Negativ:** Das gesamte JavaScript-Bundle (die Logik der Filter) muss im Hintergrund heruntergeladen und ausgeführt (hydriert) werden, bevor die Filter-Buttons tatsächlich klickbar und interaktiv sind.
*   **Risiken und Minimierung:** Bei langsamen Verbindungen kann ein Filterklick vor abgeschlossener Hydration ins Leere laufen. Die schlanke Filterlogik wird früh geladen; Controls bleiben bis zur Interaktivität deaktiviert. Die URL hält die Auswahl wiederherstellbar und teilbar.

---

## 3. Session-Detailseiten (Federführend: Georg Richter / Review: Eric Drößiger)

### Kontext
Jede der 20 Sessions besitzt eine eigene Detailseite (`/sessions/[id]`) mit Abstract, Start-/Endzeit, Format, Level und Raum. Da Session-Seiten öffentlich über Suchmaschinen (SEO) und Social-Media-Previews auffindbar sein sollen, scheidet reines CSR aus. Anders als bei den Speaker-Biografien können sich logistische Metadaten wie Raum oder Uhrzeit bei kurzfristigen Konferenzänderungen jedoch ändern.

### Betrachtete Optionen
*   **ISR (Incremental Static Regeneration):** Hält Daten aktuell, erfordert aber ein serverseitiges Laufzeit-Setup bzw. Meta-Framework (wie Nuxt), was unser Vue+Vite-Grundgerüst übersteigt.
*   **Reines SSG (Static Site Generation):** Bietet hohe Performance und SEO, liefert bei Raumänderungen ohne neuen Build aber veraltete Zeiten aus.
*   **SSG mit clientseitiger Aktualisierung (Stale-While-Revalidate-Pattern):** Liefert vollständiges statisches HTML für sofortige Anzeige und SEO aus und aktualisiert die Daten nach der Hydration im Client.

### Entscheidung
Wir wählen **SSG (Static Site Generation) kombiniert mit einer clientseitigen Aktualisierung (CSR)** zur Laufzeit.

### Konsequenzen
*   **Positiv:** Ohne zusätzliches Server-Setup erhalten Besuchende und Suchmaschinen sofort gerendertes HTML. Nach der Hydration ruft `useConferenceData()` die aktuelle `conference-data.json` im Client ab, sodass Raum- oder Zeitänderungen sofort sichtbar werden.
*   **Negativ:** Der zusätzliche Client-Request beim Seitenaufruf erzeugt geringen Netzwerk-Overhead trotz bereits ausgeliefertem HTML.
*   **Risiken:** Kurzzeitig können vor abgeschlossener Aktualisierung noch die statischen Build-Daten sichtbar sein (kurzes Umspringen), was für diesen Anwendungsfall aber vertretbar ist.
*   **Nachtrag Schritt 3:** Session- und Speaker-Seiten werden mit `dirStyle: 'flat'` als `sessions/<id>.html` statt `sessions/<id>/index.html` ausgegeben, damit der Service Worker sie offline im Precache findet ([ADR-0006, Abschnitt 1](../schritt3/03-entscheidungsprotokoll.md)). Die Rendering-Strategie selbst bleibt unverändert.

---

## 4. "Mein Programm"-Dashboard (Federführend: Georg Richter / Review: Eric Drößiger)

### Kontext
Die Seite "Mein Programm" zeigt eine personalisierte Übersicht der ausgewählten Sessions. Die IDs der markierten 
Sessions werden ausschließlich clientseitig im `localStorage` des jeweiligen Browsers persistiert. Es gibt keine 
Benutzerkonten und kein Login auf einem zentralen Server.

### Betrachtete Optionen
*   **SSR (Server-Side Rendering):** Der Server versucht, das personalisierte Programm zu rendern.
*   **CSR (Client-Side Rendering):** Das Framework liest den Status erst im Browser aus und rendert die Ansicht 
dynamisch.

### Entscheidung
Wir wählen reines **CSR (Client-Side Rendering)** für die personalisierte Ansicht.

### Konsequenzen
*   **Positiv:** Diese Strategie ist die logische und einzig sinnvolle Konsequenz aus der Datenarchitektur. 
Da der `localStorage` eine reine Browser-API ist, hat ein Server zur Build- oder Render-Zeit technisch gar keinen 
Zugriff darauf. SSR ist folglich ausgeschlossen. Da es sich um ein privates Dashboard handelt, fallen auch die 
üblichen CSR-Nachteile wie schlechte SEO weg – Suchmaschinen sollen und können persönliche Zeitpläne ohnehin 
nicht indexieren.
*   **Negativ:** Beim initialen Neuladen (Reload) der Seite gibt es eine kurze Verzögerung: Das HTML wird
ausgeliefert, das JavaScript muss starten, den `localStorage` auslesen (Rehydration des States) und die passenden 
Sessions aus dem `useConferenceData()` zusammensetzen, bevor die Liste erscheint.
*   **Risiken:** Der Nutzer könnte für den Bruchteil einer Sekunde einen leeren Bildschirm oder eine 
"Lade Daten..."-Meldung sehen. Dieses Verhalten ist für authentifizierte/private Dashboards jedoch 
branchenüblich und akzeptiert.