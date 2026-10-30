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
Die Übersichtsseite listet alle (20) Sessions auf und ermöglicht das Filtern nach Track, Tag und Level
(UND-Verknüpfung). Die Daten werden zentral über `useConferenceData()` bezogen. 
Da dies die Haupteinstiegsseite der Plattform ist, ist die anfängliche Ladezeit sowie die Indexierbarkeit für SEO äußerst wichtig. 
Gleichzeitig erwarten die Nutzer, dass die Filter sofort und ohne sichtbare Ladeunterbrechung reagieren, wenn sie Tracks oder Tage anklicken.

### Betrachtete Optionen
*   **Reines SSR (Server-Side Rendering):** Die Seite und jeder Filter-Status wird vom Server generiert.
*   **Reines CSR (Client-Side Rendering):** Der Client lädt ein leeres Div und baut die 20 Sessions erst auf, wenn das JavaScript geladen ist. SEO wird erschwert.
*   **Hybrides Rendering (SSG mit anschließender CSR-Hydration):** Die ungefilterte Liste aller 20 Sessions wird statisch ausgeliefert; nach der Hydration wird die Filterung rein im Client berechnet.

### Entscheidung
Wir entscheiden uns für den hybriden Ansatz: 
**SSG für den initialen Load, danach vollständige Client-Side Filterung (CSR)**.

### Konsequenzen
*   **Positiv:** Der Server sendet das komplett geformte HTML der Gesamtübersicht. Der Nutzer sieht das Programm sofort, was die wahrgenommene Ladezeit drastisch verbessert. Nach der Hydration (dem "Aufwachen" der Vue-App) übernimmt das JavaScript. Da der Datensatz mit 20 Sessions sehr klein ist, ist das Filtern im lokalen Browser-Speicher um ein Vielfaches performanter als jeder Netzwerk-Request an einen Server.
*   **Negativ:** Das gesamte JavaScript-Bundle (die Logik der Filter) muss im Hintergrund heruntergeladen und ausgeführt (hydriert) werden, bevor die Filter-Buttons tatsächlich klickbar und interaktiv sind.
*   **Risiken:** Bei extrem langsamen Verbindungen könnte es vorkommen, dass der Nutzer die Liste sieht und einen Filter klickt, bevor die Hydration abgeschlossen ist. Da unsere Logik jedoch minimal ist, betrachten wir dieses Risiko als gering.

    * **Risikominimierung:** Die Filterlogik wird direkt mit der initialen Seite geladen und die Hydration auf geringe Laufzeit optimiert. Bis die Filter interaktiv sind, werden Eingaben entweder kurz gepuffert oder die Filter-Controls als noch nicht verfügbar gekennzeichnet. Die Filterauswahl wird zusätzlich in der URL abgebildet, damit gefilterte Ansichten wiederherstellbar und teilbar sind.

---

## 3. Session-Detailseiten (Federführend: Georg Richter / Review: Eric Drößiger)

### Kontext
Jede der 20 Sessions besitzt eine eigene Detailseite (Route z.B. `/sessions/[id]`) mit Informationen wie Abstract, 
Start-/Endzeit, Format, Level und dem zugewiesenen Raum. Da Konferenz-Inhalte öffentlich auffindbar sein sollen, 
müssen diese Seiten zwingend für Suchmaschinen (SEO) und Social-Media-Scraper lesbar sein, was reines CSR 
ausschließt. Im Gegensatz zu den Speaker-Biografien sind die logistischen Metadaten einer Session (wie der Raum oder 
die genaue Uhrzeit) jedoch potenziell veränderlich, falls es auf der Konferenz zu kurzfristigen Änderungen kommt.

### Betrachtete Optionen
*   **ISR (Incremental Static Regeneration):** Bietet stets aktuelle Daten, erfordert aber ein komplexes serverseitiges 
Setup oder Meta-Frameworks (wie Nuxt), was unser aktuelles Vue+Vite-Grundgerüst übersteigt.
*   **SSG (Static Site Generation) pur:** Exzellente Performance und SEO, aber out-of-sync, wenn sich Zeiten 
ändern und kein neuer Build angestoßen wird.
*   **SSG mit anschließender CSR-Aktualisierung (Stale-While-Revalidate-Pattern):** Die Seite wird statisch generiert 
(SEO-freundlich), aber sobald das JavaScript im Browser geladen ist (Hydration), prüft der Client die Daten neu.

### Entscheidung
Wir entscheiden uns für **SSG (Static Site Generation) in Kombination mit einer clientseitigen Aktualisierung (CSR)**
zur Laufzeit.

### Konsequenzen
*   **Positiv:** Diese Lösung ist in unserem bestehenden Vite-Setup mit minimalem Aufwand umsetzbar. Der Nutzer und 
Suchmaschinen erhalten sofort das voll gerenderte HTML (Titel, Abstract) ohne Wartezeit auf ein leeres Div. 
Sobald die App hydriert ist, lädt das `useConferenceData()`-Composable die aktuellen Daten im Client nach, sodass Raum- 
oder Zeitänderungen sofort angewendet werden.
*   **Negativ:** Es entsteht ein leichter Overhead, da der Client die JSON-Datei beim Seitenaufruf neu abfragt, obwohl 
die statische Seite bereits existiert.
*   **Risiken:** Nutzer könnten für den Bruchteil einer Sekunde veraltete Zeiten (die statisch generierten) sehen, bevor 
das JavaScript die Seite aktualisiert (Flicker-Effekt). Für unseren Anwendungsfall ist dieser Kompromiss aus Performance, 
SEO und Einfachheit jedoch vertretbar.

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