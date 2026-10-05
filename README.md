# Doit — courses, progress and quizzes

A small learning app: browse courses, read lessons, mark them complete and test yourself with a timed quiz.

## Features
- Course list with search, per-course progress and overall progress
- Course detail with description and lessons; mark each lesson (or the whole course) complete
- Quiz per course: multiple choice, countdown timer, previous/next, result summary (score, correct, incorrect), retry, best score saved
- Loading skeletons, empty state (no search match), error state with retry
- Progress and scores persist across refreshes with localStorage
- Responsive desktop/mobile layout
- Dark mode, keyboard focus styles and reduced-motion support

## Stack
React 18 + Vite.

## Run locally
```bash
npm install
npm run dev
```

## Deploy
Pushing to `main` builds and publishes to GitHub Pages through `.github/workflows/deploy.yml`.

## Structure
```
src/
  api.js
  data.js
  storage.js
  App.jsx
  Quiz.jsx
  main.jsx
  styles.css
.github/
  workflows/deploy.yml
```