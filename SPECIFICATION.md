# Geography Learning App - Technical Specification

## 1. Project Overview

A web-based geography learning application focused on teaching German federal states, neighboring countries, and cities through interactive map-based exercises.

## 2. Target Audience

- **Primary users:** Children aged 11-14 years
- **Skill level:** Middle school students comfortable with detailed interfaces and text input
- **Geography knowledge:** Learning German geography (states, capitals, neighboring countries, cities)

## 3. Platform & Technical Requirements

- **Platform:** Web browser application
- **Compatibility:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Responsive:** Should work on desktop and tablet screen sizes
- **Data persistence:** LocalStorage for saving progress across sessions

## 4. Functional Requirements

### 4.1 Core Modes

#### 4.1.1 Federal State Mode
- User is shown the name of a German federal state
- User clicks on the map to identify the state location
- Award 1 point for correct map click
- After correct map click, show popup asking for the state's capital
- User types the capital name (text input)
- Award 1 point for correct capital name
- Case-insensitive matching with support for common spelling variations (e.g., "München"/"Munchen")
- On incorrect answer (map or capital), show correct answer and move to next question

#### 4.1.2 Neighbor Mode
- Extension of Federal State Mode
- Includes all German federal states AND all 9 neighboring countries:
  - Dänemark
  - Polen
  - Tschechien
  - Österreich
  - Schweiz
  - Frankreich
  - Luxemburg
  - Belgien
  - Niederlande
- Same interaction pattern: click location, then type capital name
- Award 1 point for correct location, 1 point for correct capital
- On incorrect answer, show correct answer and move to next question

#### 4.1.3 City Mode
- User is shown the name of a German city
- User clicks on the map to identify the city location
- Award 1 point for correct location (within reasonable proximity)
- On incorrect answer, show correct location and move to next question
- **Cities to include:**
  - All 16 state capitals
  - Major cities (Hamburg, Frankfurt, Köln, Leipzig, Dresden, Nürnberg, Dortmund, Essen, Bremen, Hannover, Duisburg, etc.)
  - Medium-sized cities to reach 50+ total cities

### 4.2 Map Requirements

- Display central Europe with:
  - Full view of Germany with all 16 federal states clearly visible
  - Partial view of all 9 neighboring countries
- Map must be interactive and clickable
- State/country boundaries clearly marked
- Visual feedback on hover (highlight region)
- Visual feedback on click
- After answer, highlight correct region in distinct color
- For incorrect answers, show both the user's click and the correct location

### 4.3 User Interface

#### 4.3.1 Main View
- Central map taking up majority of screen space
- Current mode indicator (Federal State / Neighbor / City)
- Current question displayed prominently above or beside map
- Current score display (e.g., "Score: 15/20")
- Mode selection menu
- Settings/options access

#### 4.3.2 Capital Input Popup
- Modal/popup overlay after correct location click
- Question: "What is the capital of [State/Country]?"
- Text input field with submit button
- Clear visual feedback for correct/incorrect answer
- Display correct answer if user is wrong before closing

#### 4.3.3 Mode Selection
- Clear buttons/menu to switch between three modes
- Ability to start new session in any mode
- Brief description of each mode

### 4.4 Scoring & Progress Tracking

#### 4.4.1 Session Scoring
- Track points earned in current session
- Display current score and total possible points
- Show percentage or ratio (e.g., "15/20" or "75%")

#### 4.4.2 Persistent Progress
- Save all scores and statistics across browser sessions
- Track per mode:
  - Total questions answered
  - Total correct answers
  - Success rate percentage
  - Best score/streak
- Historical view of past sessions (optional: date-stamped)

#### 4.4.3 Statistics View
- Dedicated page/panel showing overall statistics
- Per-mode breakdowns
- Identify weakest areas (states/countries/cities with lowest success rate)

### 4.5 Timer Feature (Optional)

- Timer can be enabled/disabled in settings
- When enabled, display countdown timer for each question
- Configurable time limit (default: 30 seconds per question)
- Visual indication when time is running low
- Treat timeout as incorrect answer
- Timer pauses during capital input popup

### 4.6 Settings

- Toggle timer on/off
- Adjust timer duration (if timer enabled)
- Reset all progress (with confirmation)
- Option to view statistics
- Map zoom/pan controls (if applicable)

## 5. Data Requirements

### 5.1 Geographic Data

#### German Federal States (16)
- Baden-Württemberg (Stuttgart)
- Bayern (München)
- Berlin (Berlin)
- Brandenburg (Potsdam)
- Bremen (Bremen)
- Hamburg (Hamburg)
- Hessen (Wiesbaden)
- Mecklenburg-Vorpommern (Schwerin)
- Niedersachsen (Hannover)
- Nordrhein-Westfalen (Düsseldorf)
- Rheinland-Pfalz (Mainz)
- Saarland (Saarbrücken)
- Sachsen (Dresden)
- Sachsen-Anhalt (Magdeburg)
- Schleswig-Holstein (Kiel)
- Thüringen (Erfurt)

#### Neighboring Countries (9)
- Dänemark (Kopenhagen)
- Niederlande (Amsterdam)
- Belgien (Brüssel)
- Luxemburg (Luxemburg)
- Frankreich (Paris)
- Schweiz (Bern)
- Österreich (Wien)
- Tschechien (Prag)
- Polen (Warschau)

#### German Cities (50+)
Must include all state capitals plus major/medium cities. Exact list to be determined during implementation, but should include cities like:
- Frankfurt am Main
- Köln
- Dortmund
- Essen
- Leipzig
- Dresden
- Nürnberg
- Hannover
- Duisburg
- Bochum
- Wuppertal
- Bielefeld
- Bonn
- Münster
- Karlsruhe
- Mannheim
- Augsburg
- Wiesbaden
- Mönchengladbach
- Gelsenkirchen
- Aachen
- Braunschweig
- Chemnitz
- And others...

### 5.2 Map Data
- SVG or interactive map format with clickable regions
- State boundaries for Germany
- Country boundaries for neighbors
- Coordinate data for city locations

## 6. Non-Functional Requirements

### 6.1 Usability
- Clear, age-appropriate interface
- Intuitive navigation
- Minimal learning curve (user should understand how to play within 30 seconds)
- Responsive feedback (visual and textual) for all interactions

### 6.2 Performance
- Fast loading time (< 3 seconds initial load)
- Immediate response to clicks (< 100ms)
- Smooth animations and transitions

### 6.3 Accessibility
- Keyboard navigation support
- Sufficient color contrast for visibility
- Clear, readable fonts
- Support for zoom/pan on smaller screens

### 6.4 Data Persistence
- Reliable localStorage implementation
- Graceful handling of localStorage unavailability
- Data should persist across browser sessions
- Export/backup of progress data (nice to have)

## 7. Future Considerations (Out of Scope for V1)

- Multiple user profiles
- Difficulty levels
- Timed challenge modes
- Achievement/badge system
- Extended geography (other European regions, rivers, mountains)
- Mobile app versions
- Multiplayer/competitive modes
- Audio pronunciation of place names

## 8. Success Criteria

The application will be considered successful if:
- User can complete all three modes without technical issues
- Scores persist correctly across sessions
- Map interactions are accurate and responsive
- Capital text input accepts correct answers reliably
- Interface is clear and appropriate for target age group
- User can track progress over time effectively
