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

[Formulieren Sie die Entscheidung klar und prägnant. Verwenden Sie
die aktive Form: "Wir werden X verwenden" statt
"X sollte in Betracht gezogen werden."]

## Betrachtete Alternativen

### [Alternative 1]
- Vorteile: ...
- Nachteile: ...
- Warum abgelehnt: ...

### [Alternative 2]
- Vorteile: ...
- Nachteile: ...
- Warum abgelehnt: ...

## Konsequenzen

### Positiv
- [Was wird einfacher oder besser]

### Negativ
- [Was wird schwieriger oder schlechter]

### Risiken
- [Was könnte schiefgehen]

## Verwandte Entscheidungen

- [Links zu verwandten ADRs]