# EXCELIS — Logo & Identity Kit

"Empowering Excellence." Teal + metallic-silver identity with the EX monogram, the silver
shooting-star swoosh, and a Cinzel serif wordmark. All marks are vector (SVG) masters;
PNGs are exports — regenerate rather than upscale. Open `brand-sheet.html` to see everything rendered.

> Note on the metallic look: the silver is a **gradient**, not a flat colour. It's baked into
> the SVGs. When a placement can't use SVG (some email clients, embroidery, single-ink print),
> use the **mono** builds instead.

---

## 1. Palette

| Token                   | Hex       | Use                                            |
| ----------------------- | --------- | ---------------------------------------------- |
| `--excelis-teal`        | `#0C616C` | Primary — letters, wordmark, buttons, links    |
| `--excelis-teal-deep`   | `#083F48` | Gradient shadow, dark headers, hovers          |
| `--excelis-teal-bright` | `#12808F` | Gradient highlight, accents                    |
| `--excelis-silver`      | gradient  | Swoosh + star (see SVG `#silver` / `#silverH`) |
| `--excelis-grey`        | `#A9ACAE` | Tagline, secondary text                        |
| `--excelis-ink`         | `#0E1719` | Dark UI background                             |

```css
:root {
  --excelis-teal: #0c616c;
  --excelis-teal-deep: #083f48;
  --excelis-teal-bright: #12808f;
  --excelis-grey: #a9acae;
  --excelis-ink: #0e1719;
}
```

Typefaces: **Cinzel** (SemiBold/Bold) for the wordmark; **Poppins Light** letterspaced for the
tagline. The wordmark is outlined to paths — no font install needed to render the logo.

---

## 2. Which file where

| Placement                   | File                                                            |
| --------------------------- | --------------------------------------------------------------- |
| Landing hero, certificates  | `svg/excelis-logo-stacked.svg`                                  |
| Landing header / navbar     | `svg/excelis-logo-horizontal.svg`                               |
| App top bar (compact)       | `svg/excelis-logo-horizontal-no-tagline.svg`                    |
| Dark navbar / footer        | `svg/excelis-logo-horizontal-dark.svg`                          |
| Sidebar — expanded          | `web/sidebar-expanded.svg` (+ `-dark`)                          |
| Sidebar — collapsed rail    | `web/sidebar-collapsed.svg` (+ `-dark`)                         |
| App boot / splash           | `web/splash-light.svg`, `web/splash-dark.svg`                   |
| Browser tab                 | `favicon/favicon.svg`, `favicon/favicon.ico`                    |
| iOS home screen             | `favicon/apple-touch-icon-180.png`                              |
| PWA manifest                | `favicon/icon-192.png`, `icon-512.png`, `maskable-icon-512.png` |
| Link previews (OG/Twitter)  | `web/og-image.svg` → `png/og-image-1200w.png`                   |
| Word/PDF header             | `docs/doc-header.svg` (or `png/doc-header-1600w.png`)           |
| Word/PDF footer             | `docs/doc-footer.svg` (or `png/doc-footer-1600w.png`)           |
| Page watermark              | `docs/watermark.svg` (6% opacity)                               |
| One-colour print / stamps   | `svg/excelis-logo-horizontal-mono-*.svg`                        |
| Over photos / colour blocks | `svg/excelis-logo-horizontal-mono-white.svg`                    |
| Avatars, chips, loaders     | `svg/excelis-icon.svg`, `svg/excelis-app-icon-*.svg`            |

---

## 3. Web drop-in

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon-180.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#0C616C" />
<meta property="og:image" content="https://YOUR-DOMAIN/og-image-1200w.png" />
<meta name="twitter:card" content="summary_large_image" />
```

**Theme-aware logo (no JS)**

```html
<picture>
  <source srcset="/excelis-logo-horizontal-dark.svg" media="(prefers-color-scheme: dark)" />
  <img src="/excelis-logo-horizontal.svg" alt="Excelis — Empowering Excellence" height="44" />
</picture>
```

**Angular / React sidebar**

```html
<img
  [src]="collapsed ? 'assets/logo/sidebar-collapsed.svg' : 'assets/logo/sidebar-expanded.svg'"
  alt="Excelis"
  class="sidebar-logo"
/>
```

```css
.sidebar-logo {
  height: 38px;
  width: auto;
  display: block;
}
```

**site.webmanifest**

```json
{
  "name": "Excelis — Empowering Excellence",
  "short_name": "Excelis",
  "theme_color": "#0C616C",
  "background_color": "#F6F8F8",
  "display": "standalone",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    {
      "src": "/maskable-icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

---

## 4. Usage rules

- **Clear space:** keep free space equal to the height of the wordmark's "E" on all sides.
- **Minimum sizes:** stacked lockup 220px wide; horizontal with tagline 260px; without tagline 150px; monogram alone ~40px. Below 40px use the favicon build — the swoosh and star simplify for legibility.
- **Backgrounds:** full-colour (teal + silver) on white/off-white only. On dark, mid-tone or photographic backgrounds, use the dark or mono-white build.
- **Silver is directional:** the gradient runs top-dark → highlight → bottom-dark to read as brushed metal. Don't flip it to a flat grey; use the mono builds when you need a solid single colour.
- **Don't:** recolour the teal, stretch/rotate, add shadows, box the logo in an unapproved container, re-typeset the wordmark in another font, or detach the swoosh/star from the mark.
- **Favicon geometry is intentionally simpler** — bolder EX, shorter swoosh, single star, square frame — so it holds at 16px. Don't substitute the full monogram.

---

## 5. Regenerating

PNGs were exported from the SVG masters at the widths in each filename. To re-export:

```bash
rsvg-convert -w 2400 svg/excelis-logo-horizontal.svg -o out.png
# or
npx svgexport svg/excelis-logo-stacked.svg out.png 1200:
```
