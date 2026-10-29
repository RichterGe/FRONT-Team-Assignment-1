ADR durchgängig im Schema Kontext → Optionen → Entscheidung → Konsequenzen.

Abweichungen von der ADR durch die Implementierung (z. B. SSR-Simulation stellt
sich als unpraktikabel heraus): in der ADR selbst nachtragen und begründen — nicht
stillschweigend anders umsetzen.

A. Rendering-Strategie-ADR
Für jeden der 4 Anwendungsteile: 
- Speaker-Profile, 
- Session-Detailseiten
- Session-Übersicht mit Filtern
- „Mein Programm"-Dashboard 

begründet festlegen: SSG, CSR, SSR oder ISR?

Begründung anhand der tatsächlichen Dateneigenschaften: ändert sich der Inhalt nie zur Laufzeit (SSG)? 
Personalisiert, liest nur clientseitig aus localStorage(CSR)? 
Potenziell veränderlich, z. B. bei Zeitplanänderung (SSR/ISR —konzeptionelle Diskussion + Simulation reicht, kein echtes Live-Backend nötig)?
Weicht ihr von der im Szenario nahegelegten Zuordnung ab: explizit begründen.


Deliverable: ADR mit kurzer Einleitung 
(~100 Wörter, allgemeine Auswahlkriterien) 
+ vier Entscheidungspunkte im Schema Kontext → Optionen [mind. 2] → Entscheidung → Konsequenzen, je 150–250 Wörter.
