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
    │   ├── artist/         ← portrait-placeholder.svg, about-placeholder.svg
    │   ├── artwork/        ← 12 example placeholder sketches
    │   ├── process/        ← stage-1 … stage-5 placeholders
    │   └── og-image.jpg    ← social sharing image (placeholder)
    ├── illustrations/      ← signature-placeholder.svg
    └── textures/           ← paper-grain.svg
```

---

## 3. Replacing placeholder content

Everything that still needs real content is labelled **"placeholder"** on the page and in the code. Search the project for `PLACEHOLDER` to find each one.

### 3.1 Contact details: `js/config.js` → `contact`

```js
whatsappNumber: "2547XXXXXXXX",  // international format, digits only, no +
whatsappIsPlaceholder: false,    // hides the "placeholder number" warning
email: "you@yourdomain.com",
instagramUrl: "https://www.instagram.com/yourhandle/",
instagramHandle: "@yourhandle",
```

Every WhatsApp, email and Instagram link on the site picks up these values automatically.

### 3.2 Prices and services: `js/config.js` → `services`

Each service has a `name`, a `description`, a `priceFrom` value (a number in KES), `sizes`, a `turnaround`, and an optional handwritten `note`. Once the prices are confirmed, set `pricesArePlaceholder: false`. You can also edit `budgetRanges` and `pricingNote`.

### 3.3 Artwork: `js/config.js` → `artworks`

1. Put the photos in `assets/images/artwork/`. JPG or WebP at about 1600px on the long edge is a good size.
2. Update each object, or add new ones:

```js
{
  id: 13,
  title: "Grandmother's Hands",
  category: "pencil",          // pencil | charcoal | nature | commission
  medium: "Graphite on paper",
  year: 2026,
  description: "A short story about the piece.",
  image: "assets/images/artwork/grandmothers-hands.jpg",
  width: 1200, height: 1600,   // real pixel size (prevents layout jumps)
  featured: true,
  size: "tall",                // large | tall | wide | regular (gallery layout)
  note: "One of my favourites.", // optional handwritten sticky note
  alt: "Pencil drawing of an elderly woman's hands folded in her lap" // optional but recommended
}
```

3. Set `artworksArePlaceholder: false`. This removes "(example placeholder image)" from the alt text.
4. Delete the old placeholder SVGs from `assets/images/artwork/`.

To add a **new category**, add it to `categories` and use its `id` in your artwork. The filters and counts update themselves.

### 3.4 Artist portraits

- **Hero portrait:** replace `assets/images/artist/portrait-placeholder.svg`, or change the `src` in `index.html` (search for `portrait-placeholder`). A portrait ratio of roughly 9:11 works best. Update the `alt` text as well.
- **About photo:** set `about.portrait` and `about.portraitAlt` in `config.js`.

### 3.5 Biography and About: `config.js` → `about`

Replace the biography paragraphs, interests, materials, philosophy, inspiration and favourite subjects with the artist's own words. Then remove the "Placeholder biography" flag in `index.html` (search for `placeholder-flag`).

### 3.6 Signature

Scan the real signature as a transparent PNG or SVG, save it into `assets/illustrations/`, and point `brand.signatureImage` at it.

### 3.7 Process images: `config.js` → `process`

Five stages, each with an image, title, text and handwritten note. Photos of a real drawing at each stage work beautifully here.

### 3.8 Testimonials: `config.js` → `testimonials`

**Only publish real words, with the client's permission.** When you add real testimonials, also remove the "Placeholder" badges: delete `quote__flag` in `main.js` and the `placeholder-flag` line in `index.html`.

### 3.9 Social sharing image and URL

Replace `assets/images/og-image.jpg` with a 1200×630 image. Before publishing, change the `og:image` / `twitter:image` meta tags to **absolute** URLs and uncomment `og:url` in `index.html`.

### 3.10 Removing the "placeholder" flags

Once everything is real, delete the `<p class="placeholder-flag">…</p>` lines in `index.html`.

---

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
- A custom pencil cursor (desktop with a mouse only; never on touch or reduced motion)
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
- `prefers-reduced-motion` turns off animations, parallax, the cursor and the trail, so all content shows immediately
- Lazy-loaded gallery images with explicit dimensions, and no libraries at all. The whole site is about 150 KB of uncompressed code.

---

## 6. Publishing

The site is fully static, so you can upload the folder to Netlify, Vercel, GitHub Pages, Cloudflare Pages or any ordinary web host.

---

© Wambui Luther Art. All artwork is the property of the artist.
