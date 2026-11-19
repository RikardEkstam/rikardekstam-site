---
name: reference-faithful-ui
description: Build or correct a website to closely match a user-supplied screenshot or mockup. Use when visual fidelity, proportions, image crops, typography or responsive adaptation matter, especially after feedback that the implementation looks different from the reference.
---

# Reference-faithful UI

Translate the selected reference into a working interface. Keep its composition recognizable across viewport sizes. Follow the user's chosen framework and hosting destination.

## Establish the target

1. Read the repository instructions and inspect the current implementation before editing. Preserve unrelated work.
2. Inspect the actual reference image. If several are supplied, use the user's selection; ask only if the target remains ambiguous. If the image is unavailable, request it rather than reconstructing it from memory.
3. Record a short visual map: section order, column ratios, content width, hero height, dominant colors, font weight and slant, image subjects and crops, card silhouettes, navigation and footer.
4. Separate confirmed content from illustrative content. Do not turn sample companies, products, testimonials or achievements into claims about the user. Use already-approved demo names with visible labels and honest interactions; otherwise resolve that content decision before publishing it.

## Implement in order of visual impact

1. Match page composition and density first: header, hero, section grid and footer. Avoid introducing extra sections or oversized spacing without a reason from the brief.
2. Match display typography and line breaks, then card proportions, colors, borders and angled shapes. Keep text selectable and links/buttons semantic; do not use the screenshot as the entire page.
3. Use supplied assets when available and appropriate. When creating replacements, preserve their subject, lighting, crop and visual weight. Describe them as recreated assets; do not claim exact fidelity. Inspect generated images before integrating them and keep source originals separate from optimized web assets.
4. Give every interactive element an honest destination or action. Approved demo cards can open a clear explanation. Do not invent product pages or use dead placeholder links.
5. Derive mobile layout from the same hierarchy. Preserve reading order, readable text, usable controls and uncropped focus indicators. Use the viewport guidance in [references/viewport-layout.md](references/viewport-layout.md) when addressing tall windows or space below the footer.

## Verify the result

- Render at the reference image's viewport size and compare screenshots directly. Check composition before micro-details. Inspect at least one narrow mobile view and one tall desktop view too.
- Wait for fonts and images before taking screenshots. For lazy images, scroll them into view; check CSS background artwork visually as well as ordinary image loading.
- Check horizontal overflow, content overlap, keyboard navigation, focus, dialog close/focus return and text contrast. Automated accessibility checks supplement visual and keyboard inspection.
- Test longer text or text enlargement when layout depends on a tight fixed height. Let content scroll instead of clipping it to fit the reference.
- Correct discrepancies and repeat the affected checks. Do not describe an unviewed render as visually verified.

## Handle design corrections

When the user says the result does not match, identify the concrete mismatches against their image and correct them. Do not defend a new visual direction or redesign again. Keep content decisions already approved in the conversation.

Finish with the working preview or screenshot, what was matched, and material differences such as substituted artwork. Distinguish local verification from verification of a deployed URL.
