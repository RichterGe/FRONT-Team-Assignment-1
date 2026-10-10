# ADR-NNNN: Komponentenschichten und Headless-Session-Filterung

## Status

Proposed

## Datum

2026-10-10

## Kontext

GameFoundry ist eine Konferenzplattform mit einer Programmübersicht, Session- und Speaker-Detailseiten sowie einem persönlichen Programm. Wir entwickeln das Projekt als Zweierteam und benötigen eine verständliche Struktur, die paralleles Arbeiten und spätere Erweiterungen unterstützt.

Die Architektur muss generische UI-Elemente, konferenzbezogene Funktionen und das Seitenlayout klar voneinander trennen.


Für die Session-Filterung wollen wir vermeiden, dass Filterzustand, Ergebnisberechnung und visuelle Darstellung innerhalb einer großen Seitenkomponente vermischt werden. Gleichzeitig soll die Architektur für den aktuellen Projektumfang überschaubar bleiben.

Die Technologieentscheidung zwischen Nuxt und Vue + Vite ist noch offen. Deshalb legen wir zunächst die logische Struktur fest; frameworkabhängige Seiten- und Routing-Pfade werden anschließend ergänzt.

## Entscheidung

Wir werden eine **schichtenbasierte Komponentenstruktur mit fachlichen Unterordnern** verwenden:

- **Base/UI:** Generische Komponenten wie z.B: `BaseButton`, `BaseInput` und `BaseSelect`. Diese kennen keine Konferenzdaten und kommunizieren über Props und Events.
- **Feature:** Konferenzbezogene Komponenten wie `SessionCard`, `SessionFilters`, `SessionList` und `ProgrammeToggle`.
- **Layout:** Seitenübergreifende Struktur wie `AppHeader`, `AppFooter` und `AppShell`, ohne fachliche Filter- oder Programmlogik.
- **Seiten:** Setzen die Komponenten zusammen und koordinieren deren Datenfluss.

Feature-Komponenten dürfen Base-Komponenten verwenden. Base-Komponenten dürfen nicht von Feature-Komponenten oder konferenzbezogenen Daten abhängen. Alle Komponenten verwenden die semantischen Design Tokens aus Teil A.


### Ordnerstruktur

root/
├── components/
│   ├── base/
│   │   ├── BaseButton.vue
│   │   ├── BaseCard.vue
│   │   ├── BaseInput.vue
│   │   └── BaseSelect.vue
│   ├── features/
│   │   ├── sessions/
│   │   │   ├── SessionCard.vue
│   │   │   ├── SessionFilters.vue
│   │   │   └── SessionList.vue
│   │   └── programme/
│   │       └── ProgrammeToggle.vue
│   └── layout/
│       ├── AppHeader.vue
│       ├── AppFooter.vue
│       └── AppShell.vue
├── composables/
│   ├── useConferenceData.js
│   └── useSessionFilters.js
└── assets/
    └── styles/
        └── main.css

tokens/
└── tokens.css



## Betrachtete Alternativen

### Rein featurebasierte Struktur ohne gemeinsame Schichten

- **Vorteile:** Alle Dateien einer Funktion liegen beieinander; Features können weitgehend unabhängig bearbeitet werden.
- **Nachteile:** Generische UI-Elemente können mehrfach entstehen oder uneinheitlich eingeordnet werden. Gemeinsames Layout und fachliche Komponenten sind weniger klar getrennt.
- **Warum abgelehnt:** Für unser Zweierteam ist eine gemeinsame Base/UI- und Layout-Schicht leichter abzustimmen. Fachliche Unterordner behalten dennoch die lokale Organisation der Features bei.


### [Alternative 2]
- Vorteile: ...
- Nachteile: ...
- Warum abgelehnt: ...

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


## Verwandte Entscheidungen

- [Links zu verwandten ADRs]