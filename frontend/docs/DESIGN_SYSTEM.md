# Design System

Design direction: **Retro-Futuristic Editorial** — inspired by magazine/editorial design with warm tones, geometric shapes, and bold personality.

This document defines the shared design language for the React project to keep every page and component visually consistent.

---

# Colors

All design tokens are defined inside the global stylesheet (for example `src/index.css`, `src/styles/global.css`, or wherever the project stores global variables).

## Backgrounds

| Token | Hex | Usage |
|------|------|------|
| `bg-bg-deep` | `#0F1923` | Main page background |
| `bg-bg-surface` | `#162232` | Cards, panels, sections |
| `bg-bg-elevated` | `#1E2F42` | Hover state, elevated elements |

## Accent Colors

| Token | Hex | Usage |
|------|------|------|
| `text-accent-coral` / `bg-accent-coral` | `#FF6B4A` | Primary accent, buttons, headings |
| `text-accent-amber` / `bg-accent-amber` | `#FFB830` | Secondary accent, technology badges |
| `text-accent-sky` / `bg-accent-sky` | `#38BDF8` | Links, highlights |

## Text Colors

| Token | Hex | Usage |
|------|------|------|
| `text-text-primary` | `#F0EDE6` | Main text |
| `text-text-secondary` | `#8B9DB5` | Secondary text |
| `text-text-dim` | `#4A6180` | Metadata |

## Borders

| Token | Hex | Usage |
|------|------|------|
| `border-border-default` | `#253549` | Default border |
| `border-accent-coral` | `#FF6B4A` | Hover border |
| `border-accent-amber` | `#FFB830` | Technology section |

## Color Rules

- Do not use purple or purple gradients.
- Do not use green-cyan gradients.
- Do not use cold gray palettes (`gray-900`, `gray-950`).
- Coral is the primary accent color.
- Amber is the secondary accent color.
- Use opacity utilities such as:

```html
bg-accent-coral/10
text-accent-amber/30
```

---

# Typography

## Fonts

| Purpose | Font | Class |
|------|------|------|
| Display | Anybody | `font-display` |
| Body | Be Vietnam Pro | `font-body` |

Google Fonts:

```
Anybody
500
600
700
800

Be Vietnam Pro
400
500
600
```

## Typography Scale

Hero

```txt
font-display text-7xl md:text-8xl font-bold tracking-tight
```

Section Heading

```txt
font-display text-2xl font-semibold
```

Card Title

```txt
font-display text-lg font-semibold
```

Body

```txt
font-body text-sm
```

or

```txt
font-body text-lg
```

Metadata

```txt
text-xs text-text-dim font-display tracking-wide
```

Section Marker

```txt
font-display text-sm tracking-widest
```

---

# Layout

## Container

```txt
max-w-5xl
mx-auto
px-6
```

## Grid

Cards

```txt
grid gap-5 sm:grid-cols-2 lg:grid-cols-3
```

Tech Stack

```txt
grid gap-4 sm:grid-cols-2 lg:grid-cols-3
```

Steps

```txt
grid gap-8 sm:grid-cols-2
```

## Card Style

```html
class="
border
border-border-default
bg-bg-surface
p-6
transition-all
duration-300
hover:-translate-y-1
hover:border-accent-coral
hover:bg-bg-elevated
hover:shadow-lg
hover:shadow-accent-coral/5
"
```

Cards should always have **sharp corners**.

Avoid using:

```txt
rounded
rounded-md
rounded-lg
rounded-xl
```

---

# Section Heading

```html
<h2 class="font-display text-2xl font-semibold text-text-primary mb-8 flex items-center gap-3">
    <span class="text-accent-coral font-display text-sm tracking-widest">//</span>
    Section Title
</h2>
```

Recommended accent colors:

| Section | Color |
|------|------|
| Pages | Coral |
| Tech Stack | Amber |
| Guide | Sky |

---

# Animations

## Fade Up

```html
<div class="animate-fade-up animate-delay-3">
    Content
</div>
```

## Hover Effects

Card lift

```txt
hover:-translate-y-1
transition-all duration-300
```

Border

```txt
hover:border-l-4
hover:border-l-accent-coral
```

Text

```txt
group-hover:text-accent-coral
transition-colors
```

Shadow

```txt
hover:shadow-lg
hover:shadow-accent-coral/5
```

## Link Underline

```html
<a class="link-underline text-text-primary">
    Link
</a>
```

## Pulse Border

Placeholder cards may use

```txt
animate-pulse-border
```

---

# Decorative Elements

## Noise Overlay

A subtle grain texture covers the page.

This should be implemented globally (typically using `body::after` inside the global stylesheet).

## Dot Divider

```jsx
<div className="flex gap-1.5">
    {Array.from({ length: 40 }).map((_, index) => (
        <span
            key={index}
            className="w-1 h-1 rounded-full bg-border-default"
        />
    ))}
</div>
```

## Background Number

```html
<span class="absolute top-3 right-4 font-display text-6xl font-bold text-accent-amber/5 select-none pointer-events-none">
    01
</span>
```

## Issue Badge

```html
<div class="bg-accent-coral text-bg-deep font-display font-bold text-xs tracking-widest px-3 py-1.5 rotate-3">
    VOL.01 / 2026
</div>
```

---

# Guide for Creating New Pages

Recommended folder structure:

```
src/
    pages/
        Home/
        About/
        Contact/
```

or

```
src/
    pages/
        Home.jsx
        About.jsx
```

depending on the project structure.

When creating a new page:

1. Use `bg-bg-deep` as the page background.
2. Use `text-text-primary` for main text.
3. Use `text-text-secondary` for descriptions.
4. Use `font-display` for headings.
5. Use `font-body` for content.
6. Use coral, amber, or sky as the accent color.
7. Cards should use `bg-bg-surface` and `border-border-default`.
8. Navigation should use `react-router-dom`'s `Link` component.

---

# Basic React Page Template

```jsx
import { Link } from "react-router-dom";

function SamplePage() {
    return (
        <div className="min-h-screen bg-bg-deep text-text-primary font-body flex flex-col items-center justify-center px-4">

            <h1 className="font-display text-6xl font-bold text-accent-coral animate-fade-up">
                Page Title
            </h1>

            <p className="mt-4 max-w-md text-center text-lg text-text-secondary animate-fade-up animate-delay-2">
                Your page description.
            </p>

            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 border border-border-default bg-bg-surface px-5 py-2.5 text-sm text-text-secondary transition hover:border-accent-coral hover:text-text-primary animate-fade-up animate-delay-3"
            >
                ← Back to Home
            </Link>

        </div>
    );
}

export default SamplePage;
```

---

# Navigation

Routing should be managed using **React Router**.

Example:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
```

Use

```jsx
<Link />
```

instead of Vue's

```vue
<RouterLink />
```

---

# Reference Files

| File | Purpose |
|------|------|
| `src/index.css` (or global stylesheet) | Design tokens, animations, utilities |
| `src/App.jsx` | Root application |
| `src/main.jsx` | React entry point |
| `src/pages/` | Application pages |
| `src/components/` | Reusable components |