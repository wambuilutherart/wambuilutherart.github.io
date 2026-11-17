# Wambui Luther Art — Interactive Digital Sketchbook

*Drawing stories, one stroke at a time.*

This is the portfolio website for **Wambui Luther Art**, a traditional pencil and charcoal artist. It's built as a digital sketchbook: graph paper, graphite lines that draw themselves, handwritten notes, and an editorial gallery.

It's plain **HTML + CSS + vanilla JavaScript + SVG**: no framework, no build step, no backend, and no paid services.

---

## 1. Run it locally

Any static server works. Opening `index.html` directly also mostly works, but a server is recommended so fonts and images behave consistently.

**VS Code:** install the *Live Server* extension, right-click `index.html`, then choose **Open with Live Server**.

**Python:**

```bash
cd wambui-luther-art
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

**Node:**

```bash
npx serve wambui-luther-art
```

---

## 2. Project structure

```
wambui-luther-art/
├── index.html              ← page structure, SEO + social meta
├── css/
│   ├── styles.css          ← design system, paper textures, all sections
│   ├── animations.css      ← SVG drawing, reveals, loader, reduced-motion rules
│   └── responsive.css      ← tablet / mobile layouts
├── js/
│   ├── config.js           ← ★ EDIT THIS: contact, bio, prices, artwork, testimonials
│   ├── main.js             ← nav, loader, reveals, parallax, cursor, doodle pad…
│   ├── gallery.js          ← masonry gallery + animated filters
│   ├── lightbox.js         ← full-screen viewer (keyboard + swipe)
│   └── commissions.js      ← rate cards + WhatsApp enquiry form
└── assets/
    ├── images/
    │   ├── artist/         ← photos of Wambui and handover moments
    │   ├── artwork/        ← the gallery pieces
    │   ├── process/        ← stage-1 … stage-5 process photos
    │   ├── story/          ← "Spot the Silver" slides
    │   └── og-image.jpg    ← social sharing image
    ├── illustrations/      ← signature.png
    └── textures/           ← paper-grain.svg
```

---

## 3. Updating the content

Almost everything lives in **`js/config.js`**. Edit it, commit, and the live site updates within a minute or two.

| What | Where in `config.js` |
|---|---|
| WhatsApp, phone, email, Instagram, TikTok | `contact` |
| Bio, About photo, lists | `about` |
| *Unseen but Not Forgotten* feature | `memorial` |
| Prices, sizes, styles, "every piece comes with" | `sizes`, `styles`, `includes`, `customQuoteNote` |
| Gallery pieces | `artworks` (and `categories` for the filters) |
| Process timeline photos | `process` |
| "Spot the Silver" game slides | `story` |
| "From the easel to the wall" photos | `moments` |

### Adding a new artwork

1. Save the photo in `assets/images/artwork/`. JPG, about 1600px on the long edge, is ideal.
2. Add an entry to `artworks`:

```js
{ id: 9, title: "New Piece", category: "portrait",      // portrait | mixed | gift
  medium: "Graphite & charcoal on Strathmore Vellum", year: 2026,
  dimensions: "A3", hours: 30,                          // optional
  description: "A sentence or two in her words.",
  image: "assets/images/artwork/new-piece.jpg", width: 1200, height: 1500,
  featured: false, size: "regular",                     // large | tall | wide | regular
  note: "a little handwritten note",                    // optional
  alt: "Describe what the drawing shows" }
```

### Changing prices

Each size in `sizes` has `drawing` and `framed` prices for 1, 2 and 3 people, plus `frameAdds` and `colourAddOn`. The price cards, the drawing/framed toggle and the enquiry-form estimate all read from here, so you only change a price once.

### Hero photo

The hero image is set directly in `index.html` (search for `wambui-at-easel.jpg`).

### Signature mark

The "signature" in the About and Contact sections is the same hand-drawn mark as the loading screen. It's drawn in code (search `sign-mark` in `index.html`), so there's no image to replace. (`assets/illustrations/signature.png` is no longer used and can be deleted.)

### Currencies

Price cards can be shown in KSh, US$, £ or €. Rates are fetched live once a day from a free service (open.er-api.com). If that fails, the `exchange.fallback` rates in `config.js` are used, so update those now and then. Prices are always charged in KSh.

### Story videos

Any slide in `story.slides` can be a short `.mp4` or `.webm` instead of a `.jpg`. Videos play muted and on a loop.

### Social sharing image

`assets/images/og-image.jpg` (1200 × 630) is what shows when the link is shared on WhatsApp, Instagram and so on.

## 4. How the WhatsApp enquiry works

1. The visitor picks an artwork type and size, enters their details, and can optionally choose a reference photo.
2. A live preview shows exactly what the message will say.
3. **Send enquiry via WhatsApp** checks the required fields (name, a valid WhatsApp number, artwork type and size). It then builds a formatted, URL-encoded message and opens `https://wa.me/<number>?text=…`.
4. The visitor presses **Send** in WhatsApp.

Some limits to know about:

- A static website **cannot send WhatsApp messages automatically**, and `wa.me` links **cannot carry image attachments**.
- The reference photo is shown only as a local preview, and it never leaves the visitor's device. The site tells the visitor to attach it themselves in the chat.
- Nothing is stored or sent to any server.

---

## 5. Interactive features

- A loader that draws itself, then a hero entrance with SVG pencil strokes drawing in real time
- A realistic SVG pencil that slides in at the end of the graphite line it "drew"
- A faint graphite trail that follows the mouse over the hero (desktop only)
- A pencil cursor drawn by the browser (desktop mouse only), so clicks land exactly at the tip; links and buttons show the normal pointing hand
- A sticky nav with a hand-drawn underline that slides to the active section
- A mobile menu designed as a sketchbook contents page
- A masonry gallery with category filters (FLIP animation), a hover zoom and title reveal, and a hand-drawn circle around the active filter
- A paper lightbox: ← → keys, Esc, swipe, focus trap, prev/next, wrap-around
- A process timeline whose pencil line draws itself as you scroll (horizontal on desktop, vertical on mobile)
- Rate cards that tilt in 3D under the cursor, with a pencil circle drawn around the price
- An enquiry form with inline validation, a live message preview, image preview and drag-and-drop
- A doodle pad with pencil, charcoal and eraser tools (pressure-aware with a stylus) and PNG download
- A scroll-progress graphite line, a back-to-top button with a self-drawing ring, and subtle parallax

### Accessibility and performance

- Semantic landmarks, a skip link, labelled form fields, `aria-live` status messages and `aria-pressed` filter buttons
- Visible dashed focus outlines and full keyboard support (the filters use arrow keys)
- `prefers-reduced-motion` turns off animations, parallax and the trail, so all content shows immediately
- Lazy-loaded gallery images with explicit dimensions, and no libraries at all. The whole site is about 150 KB of uncompressed code.

---

## 6. Publishing

The site is fully static, so you can upload the folder to Netlify, Vercel, GitHub Pages, Cloudflare Pages or any ordinary web host.

---

© Wambui Luther Art. All artwork is the property of the artist.
