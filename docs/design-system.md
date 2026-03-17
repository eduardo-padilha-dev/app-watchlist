# Design System Document: The Cinematic Canvas

## 1. Overview & Creative North Star: "The Digital Curator"
The objective of this design system is to transcend the "utility app" feel and position the application as a premium cinematic experience. Our Creative North Star is **"The Digital Curator."** 

Unlike generic management tools that rely on rigid grids and heavy borders, this system treats content as art. We break the "template" look through **intentional asymmetry**, where hero elements bleed into the margins, and **tonal depth**, where the interface feels like layered sheets of obsidian and frosted glass. By prioritizing negative space and high-contrast typography, we ensure that the film metadata feels editorial, not just functional.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep, ink-like tones to minimize eye strain and make movie poster colors "pop."

### Brand & Functional Palettes
*   **Primary (Electric Cyan):** `#6dddff` (Primary) / `#00d2fd` (Container). Used for the "Watch" actions and critical paths.
*   **Secondary (Neon Violet):** `#ac89ff` (Secondary) / `#7000ff` (Container). Used for discovery, AI recommendations, and premium features.
*   **Background:** `#0c0e12` (The foundation).

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. 
*   Boundaries must be defined solely through background color shifts.
*   Example: Use `surface-container-low` for a sidebar sitting on a `surface` background. The change in hex value is the "border."

### Surface Hierarchy & Nesting
Treat the UI as a physical stack.
1.  **Bottom Layer:** `background` (#0c0e12) - The infinite void.
2.  **Section Layer:** `surface-container-low` (#111318) - For grouping large content areas.
3.  **Component Layer:** `surface-container` (#171a1f) - For standard cards and inputs.
4.  **Elevated Layer:** `surface-container-highest` (#23262c) - For modals or active navigation items.

### The "Glass & Gradient" Rule
To achieve a signature look, floating headers and navigation bars must use **Glassmorphism**:
*   **Background:** `surface` at 70% opacity.
*   **Backdrop-blur:** 16px to 24px.
*   **Glow:** Use a subtle linear gradient on primary CTAs (from `primary` to `primary_dim`) to give buttons a "lit-from-within" soul.

---

## 3. Typography: Editorial Authority
We pair **Plus Jakarta Sans** for high-impact display with **Inter** for clinical interface precision.

*   **Display (Large/Med):** Used for movie titles. The 3.5rem size creates a sense of "Big Screen" scale.
*   **Headline (Sm/Med):** Used for category titles (e.g., "Trending Now"). 
*   **Body (Md/Lg):** Inter is the workhorse here. We use generous line-height (1.6) for movie synopses to maintain readability against dark backgrounds.
*   **Labels:** Strict use of `label-md` (0.75rem) in `on-surface-variant` (#aaabb0) for metadata like "4K", "HDR", or "124 min".

---

## 4. Elevation & Depth
We replace traditional shadows with **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural "recessed" or "lifted" look without visual clutter.
*   **Ambient Shadows:** For "floating" elements like Detail Modals, use an extra-diffused shadow:
    *   *Y: 20px, Blur: 40px, Color: rgba(0, 0, 0, 0.4).* 
    *   Never use pure black shadows; use a tinted version of the background to simulate light absorption.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., input focus), use `outline-variant` (#46484d) at **20% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components

### Film Cards (The Hero)
*   **Structure:** No dividers. Use `surface-container` with a `lg` (0.5rem) corner radius.
*   **Interaction:** On hover, the card should scale (1.05x) and gain a subtle glow using `primary` at 10% opacity.
*   **Metadata:** Use vertical white space (Spacing 4: 1rem) instead of lines to separate the title from the year/rating.

### Buttons
*   **Primary:** Solid `primary` background. `on-primary` text. No border.
*   **Secondary (The Ghost):** `surface-tint` at 10% opacity background with `primary` text. This feels "integrated" into the dark theme.
*   **Corner Radius:** Always `full` (pill-shaped) for CTAs to contrast against the rectangular movie posters.

### Inputs & Search
*   **Style:** `surface-container-highest` background.
*   **Focus State:** Instead of a thick border, use a subtle glow (`primary` shadow with 4px blur) and transition the icon color to `primary`.

### Navigation Rails
*   Instead of a top bar, use a side rail on desktop to maximize vertical space for posters. Use `surface-container-low` with no border, separating it from the main feed purely through tone.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Let the main hero movie poster bleed off the right edge of the screen on desktop to suggest "more content."
*   **Embrace Negative Space:** Use Spacing 10 (2.5rem) or 12 (3rem) between sections to let the posters breathe.
*   **Color-Pill Metadata:** Use small `secondary_container` chips for genres (e.g., "Sci-Fi") to add splashes of neon across the dark UI.

### Don't:
*   **Don't use Dividers:** Never use `<hr>` or border-bottom. Use a 2rem vertical gap or a slight surface color change.
*   **Don't use Pure White:** Avoid `#FFFFFF` for text. Use `on-surface` (#f6f6fc) to reduce "halation" (the glowing effect of white text on black screens).
*   **Don't Over-round:** Keep card corners at `lg` (0.5rem). Making them too round (`xl` or `full`) makes the application look like a toy rather than a premium cinema tool.