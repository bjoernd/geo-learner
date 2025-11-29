# Testing Checklist

## Mode Selection
- [x] Can select Federal State mode
- [x] Can select Neighbor mode
- [x] Can select City mode
- [x] Mode description is clear and accurate
- [x] Switching modes during session shows confirmation dialog

## Federal State Mode
- [x] All 16 federal states appear as questions
- [x] Can click on correct state
- [x] Capital input modal appears after correct click
- [x] Can type capital name
- [x] Correct capital is accepted
- [x] Umlaut variations are accepted (München/Munchen)
- [x] Incorrect capital shows correct answer
- [x] Score increases for correct location (+ 1)
- [x] Score increases for correct capital (+ 1)
- [x] Incorrect answers show correct location
- [x] Session ends after all states

## Neighbor Mode
- [ ] All 25 locations appear (16 states + 9 countries)
- [ ] Can click on states
- [ ] Can click on countries
- [ ] Capital input works for both
- [ ] All country capitals accepted correctly

## City Mode
- [ ] All 20 cities appear as questions
- [ ] Can click near city location
- [ ] Proximity detection works (within ~30px)
- [ ] No capital input for cities
- [ ] Score increases for correct click
- [ ] Incorrect click shows correct location

## Map Interactions
- [ ] Map loads correctly
- [ ] Regions highlight on hover
- [ ] Click feedback is immediate
- [ ] Correct answer shows green highlight
- [ ] Incorrect answer shows red highlight
- [ ] Highlights clear before next question

## Timer (when enabled)
- [ ] Timer appears when enabled in settings
- [ ] Countdown works correctly
- [ ] Timer pauses during capital input
- [ ] Timer resumes after capital modal closes
- [ ] Visual warning when < 10 seconds
- [ ] Critical animation when < 5 seconds
- [ ] Timeout treated as incorrect answer
- [ ] Timer resets for each question

## Score Display
- [ ] Shows current score
- [ ] Shows total possible score
- [ ] Shows percentage
- [ ] Updates in real-time

## Settings
- [ ] Can open settings modal
- [ ] Can toggle timer on/off
- [ ] Can adjust timer duration (10-120s)
- [ ] Settings persist across sessions
- [ ] Can view statistics from settings
- [ ] Reset progress shows confirmation
- [ ] Reset progress actually clears data

## Statistics
- [ ] Shows total sessions played
- [ ] Shows per-mode statistics
- [ ] Shows success rates
- [ ] Shows best scores
- [ ] Shows weak areas when available
- [ ] Empty state shown when no data
- [ ] Statistics persist across sessions

## Session Management
- [ ] Can end session early
- [ ] End session shows confirmation
- [ ] Session end shows score summary
- [ ] Prompt to play again works
- [ ] Statistics recorded at session end

## Data Persistence
- [ ] Settings persist after browser refresh
- [ ] Statistics persist after browser refresh
- [ ] Can clear browser data and restart
- [ ] No console errors related to storage

## Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Sidebar stacks on mobile
- [ ] Map is usable on all sizes

## Accessibility
- [ ] Can navigate with keyboard
- [ ] Enter key submits capital answer
- [ ] Escape key closes modals
- [ ] Tab order is logical
- [ ] Color contrast is sufficient
- [ ] Text is readable

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Performance
- [ ] Initial load < 3 seconds
- [ ] Click response < 100ms
- [ ] No lag during gameplay
- [ ] No memory leaks during extended play

## Error Handling
- [ ] Graceful handling when localStorage unavailable
- [ ] Graceful handling when map fails to load
- [ ] No crashes during normal gameplay
- [ ] Console is clean (no errors)
