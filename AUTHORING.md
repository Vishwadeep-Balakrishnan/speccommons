# Authoring Guide — Speculative Commons

This guide covers how to add, edit, hide, and remove essays and homepage tiles.

## How the publishing system works

The site is data-driven:

- `data/essays.js` is the single source of truth for homepage tiles.
- `js/main.js` reads `window.ESSAYS` and renders the homepage grid.
- `essays/<slug>.html` contains the full essay content page.

A tile appears on the homepage when an essay object exists in `data/essays.js` and is **not** archived.

## Essay object reference (`data/essays.js`)

Each essay entry looks like this:

```js
{
  slug: 'my-essay-slug',
  title: 'My Essay Title',
  subtitle: 'Optional subtitle used on the essay page',
  description: 'Short summary shown on the homepage tile',
  tag: 'Research',
  year: '2026',
  status: 'published', // 'published' | 'in-progress' | 'forthcoming' | 'archived'
  date: '2026-04-19',
  readingTime: '8 min',
  coverFrom: '#ddd8ce',
  coverTo: '#c9c4b8',
  coverImage: null // or 'assets/my-cover.jpg'
}
```

## Status behavior (controls clickability and visibility)

`status` controls whether a tile is clickable, what label appears, and whether it is shown at all.

### `status: 'published'`

- Tile is rendered as a clickable `<a>` link to `essays/<slug>.html`
- Tile shows **"Read essay"**
- Use this when the essay page is ready for readers

### `status: 'in-progress'`

- Tile is visible but rendered as a muted, non-clickable `<article>`
- Tile shows **"In progress"** badge
- Use this when work has started but is not ready to read

### `status: 'forthcoming'`

- Tile is visible but rendered as a muted, non-clickable `<article>`
- Tile shows **"Forthcoming"** badge
- Use this when planned but not yet in drafting/release state

### `status: 'archived'`

- Tile is **hidden from the homepage completely**
- Essay entry stays in `data/essays.js` for recordkeeping/history

## Add a new essay tile + essay page

1. Add a new object to `data/essays.js`.
2. Create `essays/<slug>.html` (slug must match the data entry).
3. Choose a status:
   - `published` to make tile clickable now
   - `in-progress` or `forthcoming` to show non-clickable muted tile
4. Open `index.html` in a browser and confirm the tile renders correctly.

Example new entry:

```js
{
  slug: 'new-cause-mapping',
  title: 'New cause mapping',
  subtitle: 'A pilot map of neglected interventions',
  description: 'A first pass at ranking underexplored intervention areas.',
  tag: 'Framework',
  year: '2026',
  status: 'in-progress',
  date: null,
  readingTime: null,
  coverFrom: '#d8d3c9',
  coverTo: '#c8c2b5',
  coverImage: null
}
```

## Make a tile clickable

To make a tile clickable on the homepage:

1. Ensure `essays/<slug>.html` exists.
2. In `data/essays.js`, change:

```js
status: 'in-progress' // or 'forthcoming'
```

to:

```js
status: 'published'
```

After this change, the homepage automatically switches from a muted badge tile to a clickable tile with **"Read essay"**.

## Modify an existing tile

Edit the essay object in `data/essays.js`:

- `title`, `description`, `tag`, `year` change tile text
- `status` changes clickability/visibility
- `coverFrom`, `coverTo`, `coverImage` change tile artwork

No manual homepage HTML edits are needed for normal tile updates.

## Hide or delete a tile/essay

### Recommended: hide from homepage (non-destructive)

Set:

```js
status: 'archived'
```

This removes it from homepage rendering while preserving data/history.

### Full deletion (destructive)

1. Remove the essay object from `data/essays.js`.
2. Delete `essays/<slug>.html`.
3. Remove any now-unused image from `/assets/`.

## Cover images guide (gradient + custom image)

You can use either gradients, custom images, or both (image with gradient fallback).

### Option A: Gradient-only cover

In `data/essays.js`:

```js
coverFrom: '#ddd8ce',
coverTo: '#c9c4b8',
coverImage: null
```

### Option B: Custom image on homepage tile

1. Put image in `/assets/` (for example `assets/my-cover.jpg`).
2. Set in `data/essays.js`:

```js
coverFrom: '#ddd8ce',
coverTo: '#c9c4b8', // keep as fallback colors
coverImage: 'assets/my-cover.jpg'
```

The homepage tile will render the image. Keeping gradient values provides fallback styling.

### Option C: Custom image in essay hero section

In `essays/<slug>.html`, update hero artwork:

```html
<div class="essay-hero-artwork">
  <img src="../assets/my-cover.jpg" alt="Descriptive alt text">
</div>
```

If you prefer gradient-only hero artwork, keep the existing gradient div pattern used in current essays.

## Managing `/assets/`

Use `/assets/` for cover images and other static media referenced by essays.

Recommended practices:

- Use clear, stable filenames (example: `neglected-opportunities-cover.jpg`)
- Prefer web-friendly formats (`.jpg`, `.png`, `.webp`)
- Keep paths relative to repo root in `data/essays.js` (example: `assets/file.jpg`)
- Use `../assets/file.jpg` from files in `/essays/`
- Remove unused files when essays are fully deleted
- Keep `.gitkeep` if needed to preserve the directory when empty

## Editing essay content

To edit an essay:

1. Open `essays/<slug>.html`.
2. Update title/subtitle/meta content in the header section.
3. Update body sections, headings, paragraphs, and links.
4. Confirm navigation links still point correctly (usually `../index.html`).
5. Preview in browser.

Also update `data/essays.js` when metadata shown on homepage should change (title, description, tag, year, status, artwork).

## Quick reference checklist

- [ ] **Add essay**: add object in `data/essays.js` + create `essays/<slug>.html`
- [ ] **Publish essay (clickable tile)**: set `status: 'published'`
- [ ] **Show coming soon tile**: set `status: 'in-progress'` or `status: 'forthcoming'`
- [ ] **Hide from homepage**: set `status: 'archived'`
- [ ] **Delete essay completely**: remove data entry + delete HTML + clean unused `/assets/` files
- [ ] **Add cover image**: add image to `/assets/` + set `coverImage: 'assets/<file>'`
- [ ] **Keep fallback gradient**: keep `coverFrom` / `coverTo` even when using `coverImage`
- [ ] **Update essay page hero image** (optional): use `../assets/<file>` in `essays/<slug>.html`
