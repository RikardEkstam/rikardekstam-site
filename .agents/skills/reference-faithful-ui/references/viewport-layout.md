# Filling tall viewports without distorting the design

Use this when content ends above the bottom of a tall window or when a mockup's fixed proportions leave unused space after the footer.

## Page shell

Keep the footer in normal flow. A minimum viewport height lets short pages fill the screen while long pages scroll:

```css
body {
  margin: 0;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
body > header,
body > footer { flex-shrink: 0; }
body > main { flex: 1 0 auto; }
```

Adapt selectors to the existing markup. Inspect wrapper heights, margins and width constraints: growing the main element alone can merely relocate the empty space above the footer.

## Distribute the extra height

- Let the homepage's inner wrapper fill the main element with a column layout. Preserve its existing maximum width.
- Give the hero modest, bounded growth on desktop with `clamp()`. Choose the baseline and maximum from the actual design; numbers from another project are not defaults.
- Let a content wrapper absorb remaining space with flex layout, a minimum `gap` and `justify-content: space-evenly`. Keep section rows at their natural height so project cards do not stretch.
- Center hero copy within the additional height and inspect background image crops at both limits. Avoid stretching raster images.
- Keep mobile stacking and natural scrolling. Do not force a long page into one screen or fix the footer over the content.

## Verify the behavior

Compare the same desktop width at short, typical and tall heights, for example 900, 1160, 1440 and 2160 CSS pixels. Also check a narrow phone and a portrait tablet.

Confirm that the footer's bottom coincides with the document bottom, the document fills at least the viewport, cards keep their intended dimensions, and content never overlaps the footer. Short windows should scroll. Resize the same page and check text enlargement so the result is not dependent on the initial viewport.

For extremely tall views, inspect the overall balance rather than increasing text or card sizes solely to consume space. Prefer generous spacing consistent with the design.
