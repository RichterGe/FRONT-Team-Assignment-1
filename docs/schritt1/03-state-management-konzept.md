# State-Management-Konzept: „Mein Programm“

## 1. Modellierung und Laden des geteilten Datensatzes
Für die Verwaltung der statischen Konferenzdaten nutzen wir ein dediziertes Vue Composable namens `useConferenceData()` Da der Datensatz (`conference-data.json`) für alle User identisch ist und nur gelesen wird, wird er beim initialen Laden der Applikation asynchron abgerufen. Die Daten werden in einem globalen, reaktiven State (via Vue 3 Composition API `ref` oder `shallowRef`) vorgehalten. Dadurch müssen die JSON-Daten nur einmalig über das Netzwerk geladen werden und stehen anschließend allen Komponenten der Applikation verzögerungsfrei zur Verfügung.

## 2. Personalisierter State und Datenstruktur
Für das individuelle Nutzerprogramm implementieren wir ein zweites Composable: `usePersonalProgramme()`.

Bezüglich der Datenstruktur werden im `localStorage` **ausschließlich die IDs** der ausgewählten Sessions als JSON-Array (z. B. `["session-12", "session-42"]`) persistiert. Wir verzichten bewusst darauf, vollständige Session-Objekte im Local Storage zu speichern. Dies stellt sicher, dass es keine Dateninkonsistenzen gibt (Stale Data), falls sich Titel, Zeiten oder Räume im zentralen `conference-data.json` ändern sollten.

Um die vollständigen Daten für die UI bereitzustellen, nutzt das Composable eine `computed` Property. Diese gleicht die gespeicherten IDs mit dem globalen Datensatz aus `useConferenceData()` ab und liefert die vollständigen Objekte an die Ansichten (z. B. das personalisierte Dashboard) zurück.

## 3. Reaktivität und Synchronisation
Die Reaktivität über mehrere Komponenten hinweg wird durch den geteilten State im Composable sichergestellt. Wenn eine Nutzerin oder ein Nutzer in einer Komponente (z. B. einer `SessionCard`) auf „Zum Programm hinzufügen“ klickt, wird die Session-ID dem reaktiven Array in `usePersonalProgramme()` hinzugefügt. Ein Watcher oder die Hinzufügen-Funktion selbst synchronisiert diese Änderung sofort in den `localStorage`. Durch die Reaktivität von Vue aktualisieren sich alle Komponenten, die diesen State abonnieren (z. B. ein Zähler im Header oder der Status des Buttons), automatisch und synchron.

## 4. Rehydration beim Neuladen
Beim Neuladen der Seite (Page Reload) greift der Rehydration-Mechanismus:
1. Das Composable `usePersonalProgramme()` wird initialisiert.
2. Es liest synchron den gespeicherten ID-String aus dem `localStorage` und parst ihn.
3. Gleichzeitig lädt `useConferenceData()` asynchron die `conference-data.json`.
4. Sobald beide Datenquellen verfügbar sind, löst die `computed` Property aus und stellt das vollständige personalisierte Programm wieder her.

## Datenfluss- und Sequenzdiagramm (AI-generiert)

Das folgende Diagramm visualisiert den Rehydration-Prozess beim Neuladen der Applikation:

```mermaid
sequenceDiagram
    participant B as Browser (Reload)
    participant C as UI Komponenten
    participant UPP as Composable: usePersonalProgramme
    participant UCD as Composable: useConferenceData
    participant LS as localStorage
    participant JSON as conference-data.json

    B->>UPP: App initialisiert
    UPP->>LS: Lese gespeicherte Session-IDs
    LS-->>UPP: Return ['id-1', 'id-2'] (Rehydration)
    
    B->>UCD: App initialisiert
    UCD->>JSON: Fetch GET conference-data.json
    JSON-->>UCD: Return vollständiges Array (Objekte)
    
    C->>UPP: Fordert "Mein Programm" an
    UPP->>UCD: Gleicht IDs mit Basis-Daten ab
    UCD-->>UPP: Return vollständige Session-Objekte
    UPP-->>C: Rehydrierte Session-Liste rendern