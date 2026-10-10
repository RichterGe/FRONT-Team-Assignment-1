# ADR-0002: Framework- und Tooling-Setup

## Status

Approved

## Datum

2026-10-10

## Kontext

Die GameFoundry-Konferenzplattform erfordert eine Basis, die mehrere Seitentypen – einschließlich einer allgemeinen 
Übersicht, Session-Detailseiten und eines personalisierten Dashboards – sowie das State-Management zum Speichern 
eines persönlichen Programms unterstützt. Das Setup muss effizientes Routing und eine zuverlässige 
lokale Datenpersistenz ermöglichen. Unser Entwicklungsteam verfügt über aktuelle, praktische Erfahrung im Aufbau 
komponentenbasierter Architekturen mit Vue 3, Vite und TypeScript, einschließlich der erfolgreichen Implementierung 
von localStorage-Persistenz. Wir müssen einen Frontend-Stack wählen, der diese bestehende Workflow-Expertise 
maximiert und gleichzeitig die Routing-Anforderungen des Projekts erfüllt, ohne unnötigen Overhead einzuführen. 

## Entscheidung

Wir werden Vue 3 mit Vite, TypeScript und Vue Router als unser primäres Projekt-Setup verwenden.

## Betrachtete Alternativen

### Nuxt.js
- **Vorteile:** Bietet dateibasiertes Routing und Auto-Imports "out-of-the-box", was den anfänglichen Konfigurationsaufwand deutlich reduziert.
- **Nachteile:** Führt eine schwerere Abstraktionsschicht und zusätzliche frameworkspezifische Konventionen ein, die über die Standard-Vue-Entwicklung hinausgehen.
- **Warum abgelehnt:** Die integrierten Funktionen übersteigen unsere aktuellen Anforderungen. Für ein Projekt, das auf einer lokalen conference-data.json-Datei basiert, ist die zusätzliche Komplexität der Full-Stack-Fähigkeiten von Nuxt unnötig und würde die anfängliche Entwicklung verlangsamen.

### React mit Vite und React Router
- **Vorteile:** Bietet ein riesiges Ökosystem und hochflexible Komponentenstrukturen.
- **Nachteile:** Erfordert die Übernahme eines völlig anderen mentalen Modells für Reaktivität (Hooks vs. Composition API) und State-Management.
- **Warum abgelehnt:** Die Wahl von React würde die unmittelbare Vertrautheit und Workflow-Effizienz des Teams mit der Composition API von Vue 3 verwerfen.

## Konsequenzen

### Positiv
- Die Entwicklung kann sofort mit einem vertrauten, hochperformanten Build-Tool in Form von Vite beginnen.
- Wir können das "Mein Programm"-Feature sicher aufbauen, indem wir die bewährten localStorage-Persistenzmuster adaptieren, die wir bereits in anderen Vue- und TypeScript-Projekten etabliert haben.
- Vue Router ermöglicht explizite, anpassbare Routen-Definitionen, die auf die erforderlichen Übersichts- und Detailseiten zugeschnitten sind.

### Negativ
- Wir müssen Vue Router manuell installieren und konfigurieren und die Routen-Definitionen in einer dedizierten Konfigurationsdatei verwalten, anstatt uns auf automatisches dateibasiertes Routing zu verlassen.
- Wir erhalten keine automatischen Komponenten- und Composable-Imports, wie sie von Higher-Level-Frameworks bereitgestellt werden.

### Risiken
- Die manuelle Routing-Konfiguration könnte anfängliche Setup-Fehler einführen.

## Verwandte Entscheidungen

- ADR-0001: Komponentenschichten und Headless-Session-Filterung