# Rikard Ekstam — In progress

A static personal site built with Astro, TypeScript, Markdown and MDX. English content, no database, no tracking and no visitor login. The site is intentionally unindexed until launch on **rikardekstam.com**.

## Develop

Use Node 24 and npm. `npm ci`, then `npm run dev`. Run `npm run verify` before publishing. `npm run build` produces `dist/`.

In restricted environments, use `ASTRO_TELEMETRY_DISABLED=1` and an npm cache under a writable directory, for example `npm ci --cache /tmp/rikard-npm-cache`.

## Content workflow

1. Make a branch and copy the appropriate file from `templates/` into the content folder below.
2. Use a unique lowercase, hyphenated filename, e.g. `my-project.md`. The filename becomes its permanent URL slug; don't rename it after publication without adding a redirect.
3. Replace all example text. Keep `draft: true` until the content is ready. Omitted `draft` also means unpublished.
4. Set `draft: false`, open a pull request and review the Vercel preview. Merge after checks pass.

| Content | Location | Result |
| --- | --- | --- |
| Project | `src/content/projects/` | Project page and project listing. `featured: true` includes it on the homepage, ordered by `order`. |
| Article | `src/content/journal/` | Journal page, latest notes and RSS. Optional `project` links it to a project. |
| Short update | `src/content/updates/` | The referenced project's log, latest notes and RSS. `project` is required. |
| Current focus | `src/data/now.ts` | Homepage workbench and Now page. Update the date manually. |

Project status is one of `exploring`, `building`, `released`, `paused`. Put project images in `public/images/`, then specify `image: /images/name.webp` and a meaningful `imageAlt`. Links use `{ label, url }` and must be HTTP(S).

Articles support headings, fenced code with language highlighting, images, tables and trusted MDX components. Use `##` and `###` for the table of contents; the template provides the page's H1. MDX is executable source: review imports and components just as you review code. The site does not accept visitor-submitted MDX.

References must match an existing project's filename without extension. Content attached to a draft project stays unpublished even when its own `draft` is false. Drafts produce no page, RSS item, sitemap entry or homepage card. Empty collections hide their navigation and homepage sections. Direct visits to empty indexes show an honest empty state.

## Initial content

The reference project and company names appear only as explicitly labelled design examples in the temporary preview. Set DESIGN_PREVIEW=false to hide them. SITE_INDEXABLE=true always hides them. They are not content collection entries, never appear in RSS, and their buttons explain that they are examples. The first workbench entry describes building this actual site. About copy is introductory draft copy; review it before permanent-domain launch. Contact currently points to the verified public GitHub profile, with no inferred personal email address.

The homepage uses generated artwork matching the supplied reference: a warm workshop, plant, homelab, spacecraft, notebook, landscape and gear. The image sheet is optimized to WebP and displayed as CSS crops. The original generated PNG remains outside the repository.

The secondary-page illustrative workspace image is from [Unsplash](https://unsplash.com), source `photo-1497215728101-856f4ea42174`. It is not presented as a photograph of Rikard's own workspace. Fonts are bundled locally from Fontsource (Barlow Condensed and DM Sans, SIL Open Font License).

## GitHub and Vercel

Target repository: private `RikardEkstam/rikardekstam-site`; branch `main`. Connect that repo to the Vercel project with the Astro preset, Node 24, install command `npm ci`, build command `npm run build`, output `dist`. Non-main branches create previews; main publishes the temporary production address. Source visibility should stay private.

The Actions workflow runs type checks, static build and isolated content integration tests. Configure its `verify` check as required on main when repository settings are available. Vercel builds through the Git integration; no deployment token belongs in this repo.

Default build settings: `SITE_URL=https://rikardekstam-site.vercel.app`, `SITE_INDEXABLE=false`. Set `SITE_URL` to the actual assigned project alias if it differs. Leave previews unindexed. Noindex controls search indexing, not access; do not put private content in a public build.

## Launch on rikardekstam.com

1. Review actual projects, biography, images and contact information.
2. Add `rikardekstam.com` and `www.rikardekstam.com` in Vercel. Apply the DNS records Vercel provides; preserve unrelated DNS records, including email. Configure a permanent redirect from www to the apex.
3. Set **production only** `SITE_URL=https://rikardekstam.com` and `SITE_INDEXABLE=true`, then rebuild. Canonicals, social metadata, RSS and sitemaps use that origin. Preview builds remain `SITE_INDEXABLE=false`.
4. Verify HTTPS, redirects, metadata, links, images and RSS on the actual domain. Submit the sitemap if desired. The domain is not changed by the initial temporary deployment.
5. Roll back to the previous known-good Vercel deployment if needed; confirm automatic production domain assignment afterward.

## Verification

`npm run verify` checks types and static generation, then builds an isolated temporary content fixture: a published project/article/update, draft entries, draft-project dependencies and an invalid reference. Fixtures never enter the deployable source content or the final build.

`npm run build && npm run test:browser` checks navigation, responsive overflow, image loading, keyboard access and WCAG A/AA issues against the built site using a temporary local HTTP fixture. Set `PREVIEW_URL=https://your-preview.example` to check a deployed site instead. Local managed preview uses `sites-preview start /workspace/rikardekstam-site`; reuse its exact URL. Browser checks use the installed Chromium when `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` is set.
