# Design System — Game Store

Design direction: **Retro-Futuristic Editorial** — inspired by magazine/editorial design with warm tones, geometric shapes, and bold personality.

This document defines the shared design language for the React project to keep every page and component visually consistent.

---

## Colors

All colors are defined in `src/assets/main.css` via Tailwind CSS v4's `@theme` block.

### Backgrounds

| Tailwind Token | Hex | Usage |
|----------------|-----|-------|
| `bg-deep` | `#0F1923` | Primary background (full page) |
| `bg-surface` | `#162232` | Cards, content blocks |
| `bg-elevated` | `#1E2F42` | Hover states, elevated elements |

### Accents

| Tailwind Token | Hex | Usage |
|----------------|-----|-------|
| `text-accent-coral` / `bg-accent-coral` | `#FF6B4A` | Primary accent — headings, borders, CTAs, sale badges |
| `text-accent-amber` / `bg-accent-amber` | `#FFB830` | Secondary accent — prices, "NEW" badges, ratings |
| `text-accent-sky` / `bg-accent-sky` | `#38BDF8` | Tertiary accent — links, icons, platform tags |

### Status colors (new — needed for store interactions)

| Tailwind Token | Hex | Usage |
|----------------|-----|-------|
| `text-status-success` / `bg-status-success` | `#4ADE80` | Order success, in stock, "Đã mua" |
| `text-status-error` / `bg-status-error` | `#F87171` | Out of stock, payment error, form validation |
| `text-status-sale` | `#FF6B4A` (= coral) | Discount price, sale badge |
| `text-status-original` | `#4A6180` (= text-dim) | Strikethrough original price |

### Text

| Tailwind Token | Hex | Usage |
|----------------|-----|-------|
| `text-primary` | `#F0EDE6` | Primary text (warm off-white) |
| `text-secondary` | `#8B9DB5` | Descriptions, secondary text |
| `text-dim` | `#4A6180` | Metadata, strikethrough prices, less important info |

### Borders

| Tailwind Token | Hex | Usage |
|----------------|-----|-------|
| `border-default` | `#253549` | Default borders |
| `border-accent-coral` | `#FF6B4A` | Hover borders, emphasis, sale items |
| `border-accent-amber` | `#FFB830` | Featured/new item hover borders |

### Color Rules

- **DO NOT** use purple or purple gradients — this is the generic vibe code aesthetic we intentionally avoid
- **DO NOT** use green-cyan gradients
- **DO NOT** use cold grays (`gray-950`, `gray-900`) — this project uses warm navy tones
- Coral (`#FF6B4A`) is the dominant accent, used for key visual anchors and sale/discount indicators
- Amber (`#FFB830`) is the supporting accent, used for prices, ratings, and "new arrival" badges
- Status colors (`success`/`error`) are used **only** for functional feedback (stock, payment, forms) — never for decoration
- For opacity, use Tailwind syntax: `bg-accent-coral/10`, `text-accent-amber/30`

---

## Typography

### Fonts

| Role | Font | Tailwind Class | Notes |
|------|------|----------------|-------|
| Display (headings, prices) | **Anybody** | `font-display` | Geometric, bold, futuristic. Full Vietnamese support |
| Body (content) | **Be Vietnam Pro** | `font-body` | Designed specifically for Vietnamese. Default on `body` |

Fonts are loaded via Google Fonts in `index.html`:

```
Anybody: wght 500, 600, 700, 800
Be Vietnam Pro: wght 400, 500, 600
```

### Typography Scale

- **Hero title**: `font-display text-7xl md:text-8xl font-bold tracking-tight`
- **Section heading**: `font-display text-2xl font-semibold`
- **Card title (game name)**: `font-display text-lg font-semibold`
- **Body text**: `text-sm` or `text-lg` with `font-body` (default)
- **Metadata**: `text-xs text-dim font-display tracking-wide`
- **Section marker**: `font-display text-sm tracking-widest` with accent color (e.g. `//`)
- **Price (current)**: `font-display text-xl font-bold text-accent-amber`
- **Price (original, discounted)**: `font-display text-sm text-dim line-through`
- **Discount percent**: `font-display text-xs font-bold text-bg-deep bg-accent-coral px-1.5 py-0.5`

---

## Layout

### Container

- Max width: `max-w-5xl` (1280px) for content pages; `max-w-7xl` for catalog grids with many items
- Horizontal padding: `px-6`
- Centering: `mx-auto`

### Grid

- Game catalog cards: `grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Featured/carousel row: horizontal scroll `flex gap-5 overflow-x-auto`
- Tech stack / info blocks: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`
- Steps (e.g. checkout progress): `grid gap-8 sm:grid-cols-2 lg:grid-cols-4`

### Card Style

Cards use sharp corners (no `rounded-*`) for the editorial feel:

```html
className="border border-default bg-surface p-6
       transition-all duration-300
       hover:-translate-y-1 hover:border-accent-coral hover:bg-elevated
       hover:shadow-lg hover:shadow-accent-coral/5"
```

**Important**: DO NOT use `rounded-xl` or `rounded-lg` on cards. Sharp corners are a defining trait of this design — this includes cover images (see Game Cover rule below).

### Game Cover Image Rule (new)

Cover art must keep a consistent aspect ratio so catalog grids stay aligned:

```html
<div className="aspect-[3/4] overflow-hidden border border-default bg-bg-elevated">
  <img
    src={coverUrl}
    alt={gameTitle}
    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    onError={(e) => { e.currentTarget.src = "/fallback-cover.png"; }}
  />
</div>
```

- No `rounded-*` on the image container — stays consistent with card language
- Use `aspect-[3/4]` for catalog grid cards, `aspect-video` (16:9) for hero/banner images
- Always provide a fallback image on load error

### Form Input Style (new — needed for search, filters, checkout)

Design system originally had no form styling; use this for text inputs, selects:

```html
className="w-full border border-default bg-surface px-4 py-2.5
       text-sm text-primary placeholder:text-dim
       transition-colors focus:border-accent-coral focus:outline-none"
```

Error state: swap `focus:border-accent-coral` for `border-status-error`.

---

### Section Heading

Every section heading has a `//` marker prefix with an accent color:

```html
<h2 className="font-display text-2xl font-semibold text-primary mb-8
           flex items-center gap-3">
  <span className="text-accent-coral font-display text-sm tracking-widest">//</span>
  Section Title
</h2>
```

Marker colors by section:
- Featured / Catalog: `text-accent-coral`
- Genres / Platforms: `text-accent-amber`
- Reviews / Community: `text-accent-sky`

---

## Animations

### Fade Up (page load)

Use `animate-fade-up` combined with `animate-delay-{1-7}` (100ms increments):

```html
<div className="animate-fade-up animate-delay-3">
  <!-- Appears after 300ms -->
</div>
```

### Hover Effects

- **Card lift**: `hover:-translate-y-1` with `transition-all duration-300`
- **Cover zoom**: `group-hover:scale-105` on the `<img>` inside an `overflow-hidden` wrapper
- **Coral border reveal**: `hover:border-l-4 hover:border-l-accent-coral`
- **Text color shift**: `group-hover:text-accent-coral transition-colors`
- **Shadow**: `hover:shadow-lg hover:shadow-accent-coral/5`

### Link Underline

Use `link-underline` for important links — underline slides in from left on hover:

```html
<a className="text-primary link-underline" href="...">Link text</a>
```

### Pulse Border

Use `animate-pulse-border` for placeholder/skeleton cards while catalog data loads — border pulses between default and coral.

### Cart Badge Bounce (new)

When an item is added to cart, briefly bounce the cart icon badge:

```html
<span className="animate-bounce-once bg-accent-coral text-bg-deep
             text-xs font-bold rounded-full w-4 h-4
             flex items-center justify-center">
  {cartCount}
</span>
```

Note: this is the one intentional exception to "no rounded corners" — count badges are circular by convention (numerals need a circular container to stay legible at small size). All other UI stays sharp-cornered.

---

## Decorative Elements

### Noise Overlay

A subtle grain texture covers the entire page at 2.5% opacity, creating a printed-paper feel. Already configured in `main.css` via `body::after`.

### Dot Divider

Small dot row separating hero from content:

```html
<div className="flex gap-1.5">
  {[...Array(40)].map((_, i) => (
    <span key={i} className="w-1 h-1 rounded-full bg-border-default" />
  ))}
</div>
```

### Background Number

Large faded ordinal number inside cards (e.g. bestseller rank):

```html
<span className="absolute top-3 right-4 font-display text-6xl font-bold
             text-accent-amber/5 select-none pointer-events-none">
  01
</span>
```

### Status / Promo Badge (repurposed)

Originally "VOL.01 / 2026" — repurpose the same visual pattern for store badges:

```html
<div className="bg-accent-coral text-bg-deep font-display font-bold
            text-xs tracking-widest px-3 py-1.5 rotate-3">
  -30%
</div>
```

Variants:
- `bg-accent-coral` → discount badge (e.g. `-30%`)
- `bg-accent-amber` → `MỚI` (new release)
- `bg-status-error` → `HẾT HÀNG` (out of stock, use on a muted/grayscale card)
- `border border-accent-sky text-accent-sky bg-transparent` → `SẮP RA MẮT` (coming soon)

---

## Guide for Creating New Pages

Recommended folder structure:

```
src/
    pages/
        Home/
        Catalog/
        GameDetail/
        Cart/
        Checkout/
        Account/
    components/
        GameCard/
        FilterBar/
        RatingStars/
        CartBadge/
```

When creating a new page:

1. Use `bg-deep` as the page background.
2. Use `text-primary` for main text.
3. Use `text-secondary` for descriptions.
4. Use `font-display` for headings and prices.
5. Use `font-body` for content.
6. Use coral, amber, or sky as the accent color.
7. Cards should use `bg-surface` and `border-default`.
8. Navigation should use `react-router-dom`'s `Link` component.
9. Use status colors only for functional states (stock, payment, form validation), never decoratively.

---

### Basic React Page Template

```jsx
import { Link } from "react-router-dom";

function SamplePage() {
    return (
        <div className="min-h-screen bg-deep text-primary font-body flex flex-col items-center justify-center px-4">

            <h1 className="font-display text-6xl font-bold text-accent-coral animate-fade-up">
                Page Title
            </h1>

            <p className="mt-4 max-w-md text-center text-lg text-secondary animate-fade-up animate-delay-2">
                Your page description.
            </p>

            <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 border border-default bg-surface px-5 py-2.5 text-sm text-secondary transition hover:border-accent-coral hover:text-primary animate-fade-up animate-delay-3"
            >
                ← Home
            </Link>

        </div>
    );
}

export default SamplePage;
```

### GameCard Component Template (new)

```jsx
import { Link } from "react-router-dom";

function GameCard({ game }) {
    const { id, title, coverUrl, price, originalPrice, discountPercent, isNew, inStock } = game;

    return (
        <Link
            to={`/game/${id}`}
            className="group relative block border border-default bg-surface
                 transition-all duration-300
                 hover:-translate-y-1 hover:border-accent-coral hover:bg-elevated
                 hover:shadow-lg hover:shadow-accent-coral/5"
        >
            {discountPercent && (
                <div className="absolute top-3 left-3 z-10 bg-accent-coral text-bg-deep
                       font-display font-bold text-xs tracking-widest px-3 py-1.5 rotate-3">
                    -{discountPercent}%
                </div>
            )}
            {!discountPercent && isNew && (
                <div className="absolute top-3 left-3 z-10 bg-accent-amber text-bg-deep
                       font-display font-bold text-xs tracking-widest px-3 py-1.5 rotate-3">
                    MỚI
                </div>
            )}

            <div className="aspect-[3/4] overflow-hidden border-b border-default bg-elevated">
                <img
                    src={coverUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = "/fallback-cover.png"; }}
                />
            </div>

            <div className="p-4">
                <h3 className="font-display text-lg font-semibold text-primary
                       group-hover:text-accent-coral transition-colors truncate">
                    {title}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                    {originalPrice && (
                        <span className="font-display text-sm text-dim line-through">
                            {originalPrice.toLocaleString("vi-VN")}₫
                        </span>
                    )}
                    <span className="font-display text-xl font-bold text-accent-amber">
                        {price.toLocaleString("vi-VN")}₫
                    </span>
                </div>

                {!inStock && (
                    <span className="mt-2 inline-block text-xs font-display text-status-error">
                        Hết hàng
                    </span>
                )}
            </div>
        </Link>
    );
}

export default GameCard;
```

---

## Navigation

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

### Nav bar cart icon (new)

Cart icon in the header needs a count badge — this is the one place circular shape is allowed (see Cart Badge Bounce above):

```jsx
<Link to="/cart" className="relative">
  <CartIcon className="w-6 h-6 text-primary" />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-accent-coral text-bg-deep
                 text-xs font-bold rounded-full w-4 h-4
                 flex items-center justify-center animate-bounce-once">
      {cartCount}
    </span>
  )}
</Link>
```

---

## Reference Files

| File | Purpose |
|------|------|
| `src/index.css` (or global stylesheet) | Design tokens, animations, utilities |
| `src/App.jsx` | Root application |
| `src/main.jsx` | React entry point |
| `src/pages/` | Application pages (Home, Catalog, GameDetail, Cart, Checkout, Account) |
| `src/components/` | Reusable components (GameCard, FilterBar, RatingStars, CartBadge) |

---

## License note

This design system was adapted from an open-source community project's design language. Before shipping this for a commercial game store, verify the original project's license permits reuse of its design tokens/components for commercial purposes, and credit the source if required.