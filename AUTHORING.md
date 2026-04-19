# Authoring Guide — Speculative Commons

A short reference for publishing, editing, and managing essays.

---

## File structure

```
/index.html                 ← homepage (auto-renders the archive grid)
/data/essays.js             ← essay registry (single source of truth)
/essays/<slug>.html         ← individual essay pages
/css/style.css              ← shared styles (homepage + base)
/css/essay.css              ← essay page styles
/js/main.js                 ← homepage logic (reads from data/essays.js)
/assets/                    ← cover images and other media
```

---

## How the archive grid works

The homepage project grid is generated automatically from `/data/essays.js`.

- Each entry in the `window.ESSAYS` array becomes a card.
- Cards with `status: 'published'` are clickable and link to `/essays/<slug>.html`.
- Cards with `status: 'in-progress'` or `'forthcoming'` appear in a tasteful disabled state.
- Cards with `status: 'archived'` are hidden from the grid entirely.

No manual layout changes are needed when adding or removing essays — the grid adapts automatically.

---

## Publish a new essay

### Step 1 — Add the metadata entry

Open `/data/essays.js` and add a new object to the `window.ESSAYS` array:

```js
{
  slug: 'your-essay-slug',
  title: 'Your essay title',
  subtitle: 'Optional subtitle or deck line',
  description: 'A short description for the archive card (1–2 sentences).',
  tag: 'Essay',               // e.g. Research, Essay, Framework, Methodology
  year: '2025',
  status: 'published',        // 'published' | 'in-progress' | 'forthcoming' | 'archived'
  date: '2025-06-01',         // publication date (ISO format)
  readingTime: '8 min',       // estimated reading time
  coverFrom: '#ddd8ce',       // gradient start color for the cover
  coverTo: '#c9c4b8',         // gradient end color for the cover
  coverImage: null             // optional: 'assets/your-cover.jpg'
}
```

### Step 2 — Create the essay page

Copy an existing essay file (e.g. `/essays/neglected-philanthropic-opportunities.html`) and rename it to match your slug:

```
/essays/your-essay-slug.html
```

Then edit the file:
- Update the `<title>` tag
- Update the `<meta name="description">` tag
- Update the hero section (meta tags, title, subtitle, cover colors)
- Replace the essay body content with your essay
- The header nav and footer back-links are already set up

### Step 3 — Done

The homepage will automatically display the new card. No other files need to change.

---

## Edit an existing essay

### To edit the essay content:
Open `/essays/<slug>.html` and edit the HTML inside `.essay-body`.

### To update metadata (title, description, status, etc.):
Open `/data/essays.js` and modify the corresponding entry.

Both changes are independent — you can update one without touching the other.

---

## Remove an essay

### Option A — Hide it (recommended)
Set `status: 'archived'` in `/data/essays.js`. The card disappears from the homepage, but the essay file remains accessible via direct URL.

### Option B — Delete it completely
1. Remove the entry from `/data/essays.js`.
2. Delete `/essays/<slug>.html`.

---

## Cover artwork

### Using gradient covers (default)
Set `coverFrom` and `coverTo` to any hex colors. These produce the subtle gradient shown on each card and the essay hero area.

### Using image covers
1. Place the image in `/assets/` (e.g. `assets/my-cover.jpg`).
2. Set `coverImage: 'assets/my-cover.jpg'` in the essay's metadata entry.
3. In the essay HTML, replace the gradient `<div>` inside `.essay-hero-artwork` with an `<img>` tag:
   ```html
   <div class="essay-hero-artwork">
     <img src="../assets/my-cover.jpg" alt="Descriptive alt text">
   </div>
   ```

---

## Slug conventions

- Use lowercase, hyphenated slugs: `my-essay-title`
- The slug must match exactly between `data/essays.js` and the filename in `/essays/`
- Keep slugs stable once published — changing a slug breaks existing links

---

## Status reference

| Status        | Card behavior                        | Clickable? |
|---------------|--------------------------------------|------------|
| `published`   | Full card, links to essay page       | Yes        |
| `in-progress` | Muted card, "In progress" badge      | No         |
| `forthcoming` | Muted card, "Forthcoming" badge      | No         |
| `archived`    | Hidden from the grid entirely        | —          |

---

## Tips

- The grid handles any number of cards gracefully (1, 3, 7, 20+).
- Cards are rendered in the order they appear in the `ESSAYS` array — reorder the array to change display order.
- Essay pages are standalone HTML — they don't need JavaScript to render.
- All styles use CSS custom properties defined in `/css/style.css`, making it easy to adjust colors and spacing globally.
