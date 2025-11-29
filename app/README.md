# Erdkunde

Eine interaktive Webanwendung zum Erlernen der deutschen Geographie, einschließlich Bundesländer, Nachbarländer und Städte.

## Features

- **Zwei Spielmodi:**
  - Länder: Lerne alle 16 deutschen Bundesländer plus die 9 Nachbarländer und ihre Hauptstädte
  - Städte: Finde deutsche Städte auf der Karte

- **Interaktive Karte:** Klicke auf Regionen, um deine Antworten abzugeben
- **Fortschrittsverfolgung:** Statistiken und Erfolgsquoten werden gespeichert
- **Timer (optional):** Fordere dich selbst mit Zeitlimits heraus
- **Responsive Design:** Funktioniert auf Desktop und Tablet

## Technologie

- **Framework:** Svelte + TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest
- **Styling:** Scoped CSS
- **Datenspeicherung:** LocalStorage

## Installation

### Voraussetzungen

- Node.js 18+ und npm

### Lokale Entwicklung

```bash
# Repository klonen
git clone https://github.com/yourusername/geo-learner.git
cd geo-learner/app

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Die Anwendung ist dann unter http://localhost:5173 verfügbar.

### Testen

```bash
# Tests ausführen
npm test

# Tests mit UI ausführen
npm run test:ui

# Tests einmalig ausführen (CI)
npm run test:run
```

### Production Build

```bash
# Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## Projektstruktur

```
src/
├── lib/
│   ├── components/     # Svelte-Komponenten
│   ├── stores/         # State Management (Svelte Stores)
│   ├── data/           # Geografische Daten
│   ├── types/          # TypeScript-Typen
│   └── utils/          # Hilfsfunktionen
├── assets/             # Statische Assets (SVG-Karte)
├── App.svelte          # Hauptkomponente
└── main.ts             # Einstiegspunkt

tests/
├── unit/               # Unit-Tests
├── components/         # Komponenten-Tests
└── integration/        # Integrations-Tests
```

## Verwendung

1. **Modus wählen:** Wähle einen der zwei Spielmodi
2. **Frage beantworten:** Klicke auf die Karte, um die Region zu identifizieren
3. **Hauptstadt eingeben:** Im Länder-Modus wird die Hauptstadt abgefragt
4. **Fortschritt verfolgen:** Deine Statistiken werden automatisch gespeichert

## Einstellungen

- **Timer aktivieren:** Zeitlimit für jede Frage
- **Timer-Dauer:** Anpassbar von 10 bis 120 Sekunden
- **Statistiken:** Zeige deine Erfolgsquoten und Verbesserungspotenziale
- **Fortschritt zurücksetzen:** Lösche alle gespeicherten Daten

## Lizenz

MIT License - siehe LICENSE Datei für Details.

## Mitwirken

Contributions sind willkommen! Bitte öffne ein Issue oder Pull Request auf GitHub.

## Credits

- Kartendaten: [Quelle einfügen basierend auf verwendeter Karte]
- Entwickelt mit Svelte und TypeScript
