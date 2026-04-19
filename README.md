# Speculative Commons

A static editorial publishing system for **Speculative Commons** — a non-profit advocacy organisation that surfaces asymmetric philanthropic opportunities through rigorous analysis and independent thinking.

## Stack

- HTML, CSS, JavaScript (no frameworks, no build step)
- Google Fonts: Literata + Inter
- Canvas-based particle background animation

## Architecture

```
/index.html                 ← homepage with auto-generated archive grid
/data/essays.js             ← essay registry (single source of truth)
/essays/<slug>.html         ← individual essay pages
/css/style.css              ← shared styles (homepage + base)
/css/essay.css              ← essay page styles
/js/main.js                 ← homepage logic
/assets/                    ← cover images and media
```

Essays are managed through a centralized data file (`data/essays.js`). The homepage reads this file and automatically renders the project archive grid. Each published essay links to its own dedicated reading page.

## Publishing workflow

| Action           | What to do                                                        |
|------------------|-------------------------------------------------------------------|
| **Add essay**    | Add entry to `data/essays.js` + create `essays/<slug>.html`      |
| **Edit essay**   | Edit the HTML in `essays/<slug>.html` or update `data/essays.js` |
| **Remove essay** | Set `status: 'archived'` in `data/essays.js` (or delete both)   |

See **[AUTHORING.md](AUTHORING.md)** for the full authoring guide.

## Local development

Open `index.html` in a browser — no build step required.

## Deployment

Deploy directly to **GitHub Pages** or **Vercel** by pointing at the root of this repository.