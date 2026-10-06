# Pulse - Fitness Tracker

Pulse is a simple workout tracker that runs in your phone or computer browser. Log sets, beat your last numbers, track bodyweight and keep a weekly streak. No account and no server: everything is saved on your own device.

---

## Part 1: For users

### Getting started

1. Keep `index.html`, `style.css` and `app.js` together in **one folder**.
2. Open `index.html` in Chrome, Safari or any modern browser.
3. Tap **Open app** (or **Start your first workout**).

> Tip: on iPhone use Share, then Add to Home Screen. On Android use the browser menu, then Add to Home screen. Pulse then opens like a normal app.

### What you can do

| Tab | What it does |
|---|---|
| **Home** | Weekly streak, workouts this week, total workouts, bodyweight, weekly goal progress bar |
| **Workout** | Log reps and weight for each set, tick sets as done, add or remove exercises, finish or discard |
| **Exercises** | Search 26 exercises by name, muscle or equipment, read the how-to tip, add to your workout |
| **History** | See past workouts, repeat one, or delete one |
| **Progress** | Bodyweight chart, personal records (PRs) with estimated 1RM |
| **Plans** | Ready-made programs: 3-day Full Body, Push / Pull / Legs, Home Workout |
| **Profile** | Goal, level, equipment, kg or lb, age, height, rest timer, weekly goal, reminders, export / import / delete data |

### Logging a workout

1. Go to **Plans** and start a day, or press **Start workout** on Home for an empty workout.
2. Type reps and weight for each set (the hint under the exercise name shows your last numbers and a suggested weight).
3. Tap the tick button when a set is done. The **rest timer** starts automatically. Tap **+15s** to add time or **Skip** to stop it.
4. Press **Finish workout**. You get a summary with time, sets, total volume and any new PRs.

### Weekly streak

Train at least once in a week (Monday to Sunday) and your streak grows. Miss a whole week and it resets.

### Backup and moving to another phone

- **Profile, Export JSON** gives you a full backup. Use **Copy** or **Download** (on phones, Download opens the share sheet).
- **Profile, Import JSON** restores a backup from a file or pasted text. This replaces your current data.
- **Export CSV** gives your workouts as a spreadsheet.

### Privacy and limits

- Data is stored in your browser's localStorage on this device only. Nothing is sent anywhere.
- Clearing browser/site data erases your workouts. Export a backup now and then.
- Data is separate per browser and per address. Opening the app in a different browser starts empty (use Import to move data).
- **Reminders only work while Pulse is open** in the browser. A web page cannot send notifications when closed.
- Fonts come from Google Fonts, so the first load needs internet. Without it the app still works with default fonts.
- Pulse is for general fitness and is not medical advice. Talk to a doctor before starting a new program.

---

## Part 2: For developers (changing the project)

### Files

```
pulse/
  index.html   Page structure (landing page + empty app area)
  style.css    All styling, numbered sections
  app.js       All logic and screens, numbered sections
  read.md      This file
```

There are no libraries and no build step. Edit the files and refresh the browser.

Search for `=====` in `style.css` and `app.js` to jump between the numbered sections.

### How the app works

- The landing page lives in `index.html`. The app is an empty `<div id="app">` that `app.js` fills.
- `launch('tab')` opens the app, `site()` returns to the landing page, `go('tab')` switches screens.
- Each screen is a function in the `V` object (`home`, `log`, `lib`, `hist`, `prog`, `plans`, `me`) that returns an HTML string. `go()` puts that string into `#view`.
- Buttons use inline `onclick` handlers that call the global functions in `app.js`.
- Every change calls `save()`, which writes the state object `S` to localStorage under the key `pulse`.

### Saved data shape

```js
S = {
  p:    { goal, age, h, lvl, eq, unit, rest, goalW },   // profile and settings
  hist: [ { date, name, dur, ex: [ { n, sets: [ { r, w } ] } ] } ],  // finished workouts
  bw:   [ { d, w } ],                                    // bodyweight log
  rem:  { on, t, last },                                 // reminder settings
  cur:  null | { name, start, ex: [ { n, sets: [ { r, w, d } ] } ] }, // workout in progress
  theme: "light" | "dark"
}
```

Weights are **always stored in kg**. `U()` converts for display, `K()` converts back when saving. `r` = reps, `w` = weight, `d` = set done (0 or 1), `dur` = seconds.

### Common edits

| I want to... | Where |
|---|---|
| Change colors / dark mode | `style.css`, section 1 (`:root` variables) |
| Add an exercise | `app.js`, section 2, add a line: `Name\|Muscle\|Equipment\|Tip` |
| Add or edit a workout plan | `app.js`, section 2, the `PL` list (exercise names must match the library) |
| Change landing page feature cards | `app.js`, section 2, the `FT` list |
| Change a screen's layout or text | `app.js`, section 7, the matching function in `V` |
| Change default rest time or weekly goal | `app.js`, section 3, defaults in `S` (`rest`, `goalW`) |
| Add a new tab | Add it to `TABS`, add a function with the same name in `V` |
| Change button or card look | `style.css`, sections 3 and 7 |

### Adding a new tab (example)

1. In `TABS` add `['notes', 'Notes']`.
2. In `V` add `notes() { return '<h2>Notes</h2>...'; }`.
3. If the tab needs saved data, add a field to `S` and call `save()` after changing it.

### Ideas for future features

- Custom exercise creator
- Notes on each workout
- Volume-over-time chart
- Rest timer sound
- Offline install support (service worker and manifest)

### Notes for deployment

- Any static host works (GitHub Pages, Netlify, Cloudflare Pages). Upload the three files together.
- The app uses a custom on-screen confirm box instead of the browser `confirm()`, because many phone browsers and in-app viewers block `confirm()`.
- Test on a real phone after changes: keyboard behavior and touch interactions can differ from desktop.
