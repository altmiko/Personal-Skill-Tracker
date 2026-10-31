---
name: SkillTrack
description: A task-first learning journal for a personal career sprint.
colors:
  ink: "#302c29"
  paper: "#f5f1e9"
  surface: "#fffdf8"
  text: "#302c29"
  muted: "#6e6159"
  edge: "#dfd6c9"
  primary: "#91432d"
  accent: "#a14f36"
  accent-light: "#f3e6db"
  dark-paper: "#24211f"
  dark-surface: "#322d29"
typography:
  heading:
    fontFamily: "Libre Baskerville, Georgia, serif"
    fontWeight: 400
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontWeight: 400
rounded:
  control: "7px"
  card: "12px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    padding: "24px"
---

## Overview

A learning journal makes daily work and longer-term progress easy to review. Editorial typography and warm surfaces lend character without replacing familiar controls or navigation.

## Colors

Warm paper, dark ink, and muted rust establish the workspace. Dark mode uses warm charcoal surfaces. Reserve accent color for actions, selection, and progress; use labels as well as color for state.

## Typography

Libre Baskerville carries headings; DM Sans carries body text, controls, and figures. Keep task and data labels legible and use tabular figures for summary metrics.

## Layout

A persistent desktop rail becomes a horizontally scrollable navigation strip below 900px. Paired work areas stack below 600px. The overview places today's plan beside the current week, followed by a seven-day record of tasks and logged time.

## Elevation & Depth

Use surface contrast and fine boundaries rather than hard shadows. The current-week panel uses a dark warm surface.

## Shapes

Working surfaces have 12px corners; controls use 7px corners. Keep list and activity records clearly separated and easy to scan.

## Components

Use familiar buttons, inputs, checkboxes, and navigation with visible keyboard focus. Seven-day record entries open their corresponding date in Today. Completion counts refer to tasks assigned to that date, not a recorded completion timestamp.

## Do's and Don'ts

- Keep today's plan and long-term progress accessible.
- Distinguish recorded work from roadmap suggestions.
- Preserve keyboard access and light, dark, and system themes.
- Avoid turning the journal reference into decorative paper effects or unfamiliar controls.
