# ADR-0001: Komponentenschichten und Headless-Session-Filterung

## Status
Approved

## Datum
2026-30-10

## Kontext

GameFoundry ist eine Konferenzplattform für internationale Game-Development-Fachkräfte. Die geplanten Funktionen umfassen eine Programmübersicht, Session- und Speaker-Detailseiten sowie ein persönliches Programm.

Wir entwickeln die Anwendung als Zweierteam. Die Architektur schafft klare Zuständigkeiten, ermöglicht paralleles Arbeiten und unterstützt spätere Erweiterungen. Dafür trennen wir generische UI-Elemente, konferenzbezogene Funktionen und das Seitenlayout.

Bei der Session-Filterung vermeiden wir, dass Filterzustand, Ergebnisberechnung und Darstellung innerhalb einer großen Seitenkomponente vermischt sind. Gleichzeitig bleibt die Struktur für den aktuellen Projektumfang überschaubar.

[ADR-0002: Framework- und Tooling-Setup](04-technologie-adr.md) schlägt Vue 3 mit Vite, TypeScript und Vue Router vor. Die folgende Ordnerstruktur basiert auf diesem Setup und gilt vorbehaltlich der gemeinsamen Annahme von ADR-0002.



## Entscheidung

Wir verwenden eine **schichtenbasierte Komponentenstruktur mit fachlichen Unterordnern** und kapseln die **Session-Filterung als Headless-Logik in einem Composable**.

### Komponentenschichten

| Schicht | Verantwortung | Beispiele |
|---|---|---|
| **Base/UI** | Generische UI-Elemente ohne Wissen über Konferenzdaten | `BaseCard` |
| **Feature** | Konferenzbezogene Darstellung und Interaktionen | `SessionCard`, `SessionFilters`, `SessionList`, `SpeakerCard` |
| **Layout** | Seitenübergreifende Struktur und Navigation, ohne fachliche Filter- oder Programmlogik | `App.vue` (Header, Navigation, Theme-Switch, Content-Shell) |
| **Seiten (Views)** | Setzen Komponenten zusammen und koordinieren Daten sowie Aktionen | `ConferenceOverviewView`, `SessionDetailView`, `SpeakerDetailView`, `PersonalProgrammeView` |


Feature-Komponenten dürfen Base-Komponenten verwenden. Base-Komponenten hängen weder von Feature-Komponenten noch von konferenzbezogenen Composables ab. Alle Komponenten verwenden die semantischen Design Tokens aus Teil A.


### Composition und Datenfluss

Wir setzen Komponenten über Props und Slots zusammen. `BaseCard` stellt einen generischen Rahmen bereit, den `SessionCard` und `SpeakerCard` mit spezifischen Inhalten füllen.

Wir verwenden den Ein-Weg-Datenfluss **„Props nach unten, Events nach oben“**:


| Komponente | Aufgabe und Datenfluss |
|---|---|
| `SessionFilters` | Erhält Filterwerte und meldet Änderungen über `update:…`-Events beziehungsweise `v-model` sowie `clear`. |
| `SessionList` | Erhält die anzuzeigenden Sessions, Tracks und gespeicherten Session-IDs (`bookmarkedIds`) und leitet `toggleBookmark`-Events nach oben weiter. |
| `SessionCard` | Erhält Session-Daten, Track-Namen und den Auswahlstatus (`isBookmarked`) und emittiert `toggleBookmark` bei Klick auf den Bookmark-Button. |
| `SpeakerCard` | Erhält ein `ConferenceSpeaker`-Objekt über Props und stellt Name, Rolle, Firma und Biografie in einer `BaseCard` dar. |
| Zuständige View | Empfängt die Programmänderung (`@toggle-bookmark`) und ruft die entsprechende Aktion (`toggleSession`) in `usePersonalProgramme()` auf. |

Zwischenkomponenten leiten Programm-Events bei Bedarf bis zur zuständigen View weiter. Darstellungskomponenten verändern weder übergebene Session-Objekte noch die persönliche Programmliste direkt.


### Headless-Session-Filterung

Wir kapseln Filterzustand und Ergebnisberechnung in `useSessionFilters()`. Das Composable erhält die Session-Liste als reaktive Eingabe und stellt Filterwerte, gefilterte Ergebnisse und eine Reset-Funktion bereit.

Die Übersichtsseite erstellt eine gemeinsame Instanz.
`SessionFilters` zeigt die Bedienelemente und meldet Änderungen;
`SessionList` erhält die gefilterten Ergebnisse. Der Filterzustand
bleibt lokal zur Übersicht.

Diese Headless-Aufteilung ist sinnvoll, weil unterschiedliche
Filterdarstellungen, beispielsweise für Desktop und Mobilgeräte,
dieselbe Berechnung verwenden können. Außerdem lässt sich die
Filterlogik unabhängig vom UI testen. Den zusätzlichen Schnittstellenaufwand gegenüber Filterlogik direkt in der View akzeptieren wir bewusst für diese Austauschbarkeit.

Das [State-Management-Konzept](03-state-management-konzept.md) definiert den gemeinsamen Programm-State und dessen Persistenz.



### Ordnerstruktur

Die folgende Struktur basiert auf dem in ADR-0002 vorgeschlagenen Setup:

```
src/
├── assets/
│   ├── base.css
│   └── main.css
├── components/
│   ├── base/
│   │   └── BaseCard.vue
│   └── features/
│       ├── sessions/
│       │   ├── SessionCard.vue
│       │   ├── SessionFilters.vue
│       │   └── SessionList.vue
│       └── speakers/
│           └── SpeakerCard.vue
├── composables/
│   ├── useConferenceData.ts
│   ├── usePersonalProgramme.ts
│   └── useSessionFilters.ts
├── data/
│   └── conference-data.json
├── router/
│   └── index.ts
├── views/
│   ├── ConferenceOverviewView.vue
│   ├── PersonalProgrammeView.vue
│   ├── SessionDetailView.vue
│   └── SpeakerDetailView.vue
├── App.vue
└── main.ts

tokens/
└── tokens.css

docs/
├── schritt1/
└── schritt2/
```

### Komponentenübersicht

Die Übersicht zeigt die Komponentenstruktur der Anwendung. 
`App.vue` stellt den gemeinsamen Layout-Rahmen (Header, Navigation, Theme-Umschalter) bereit.
`RouterView` zeigt die jeweils aktive View im Inhaltsbereich an.



```
App (App-Shell, Header & Navigation)
└── RouterView
    ├── ConferenceOverviewView
    │   ├── SessionFilters
    │   └── SessionList
    │       └── SessionCard
    │           └── BaseCard
    ├── SessionDetailView
    ├── SpeakerDetailView
    │   └── SpeakerCard
    │       └── BaseCard
    └── PersonalProgrammeView
```



## Betrachtete Alternativen

### Rein featurebasierte Struktur ohne gemeinsame Schichten

- **Vorteile:** Alle Dateien einer Funktion liegen beieinander; Features können weitgehend unabhängig bearbeitet werden.
- **Nachteile:** Generische UI-Elemente können mehrfach entstehen oder uneinheitlich eingeordnet werden. Gemeinsames Layout und fachliche Komponenten sind weniger klar getrennt.
- **Warum abgelehnt:** Für unser Zweierteam ist eine gemeinsame Base/UI- und Layout-Schicht leichter abzustimmen. Fachliche Unterordner behalten dennoch die lokale Organisation der Features bei.


### Flache Struktur mit Logik in den Views

- **Vorteile:** Wenig initialer Strukturaufwand; Darstellung und Logik befinden sich unmittelbar beieinander.
- **Nachteile:** Views übernehmen Datenladen, Filterung, Programmverwaltung und Darstellung gleichzeitig. Wiederverwendung und isolierte Tests werden schwieriger.
- **Warum abgelehnt:** Die geplanten Seitentypen verwenden dieselben Konferenzdaten und Programm-Aktionen. Diese Logik soll nicht mehrfach in Views entstehen.



## Konsequenzen

### Positiv
- Komponenten besitzen klar abgegrenzte Verantwortlichkeiten.
- Generische UI-Elemente können in mehreren Features wiederverwendet werden.
- Filterlogik lässt sich unabhängig von der Darstellung testen.
- Desktop- und mobile Filterdarstellungen können dieselbe Logik verwenden.
- Nach Abstimmung der Schnittstellen können Darstellung und Logik parallel bearbeitet werden.

### Negativ
- Es entstehen mehr Dateien und Schnittstellen als bei einer einzelnen Seitenkomponente.
- Props, Events und Composable-Rückgabewerte müssen gemeinsam definiert werden.
- Änderungen können mehrere zusammenhängende Dateien betreffen.

### Risiken
- Zu kleine Komponenten oder unnötige Composables können die Struktur unübersichtlich machen. Wir teilen Code deshalb nur bei klarer Verantwortung oder erkennbarem Wiederverwendungsbedarf auf.
- Lade- oder Speicherfehler könnten die UI beeinträchtigen. Lade-, Leer- und Fehlerzustände werden bei der Umsetzung berücksichtigt.
- ADR und Implementierung könnten auseinanderlaufen. Beide werden im gemeinsamen Review abgeglichen.


## Verwandte Entscheidungen

- [ADR-0002: Framework- und Tooling-Setup](04-technologie-adr.md) – Proposed; Grundlage für die konkrete Projektstruktur.
- [State-Management-Konzept: „Mein Programm“](03-state-management-konzept.md) – definiert Datenladen, geteilten State, Persistenz und Rehydration.
- [Branding und Design Tokens](01-branding-design-tokens.md) – definiert die visuellen Rollen für die Komponenten.