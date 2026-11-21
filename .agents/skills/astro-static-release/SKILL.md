---
name: astro-static-release
description: Prepare, verify and release a static Astro site with Markdown or MDX content to GitHub and Vercel. Use for personal sites, portfolios and technical journals needing draft-safe publishing, temporary-domain previews, or a verified GitHub/Vercel handoff.
---

# Astro static release

Keep a content-focused site static unless its requirements need server-side behavior. Work within the existing repository, deployment target and user authorization. For current Vercel commands and platform behavior, consult the available Vercel deployment guidance rather than treating this skill as API documentation.

## Inspect and scope

1. Read repository instructions, package scripts, lockfile, content schemas, environment variable names, Git status/remotes and existing hosting configuration. Avoid printing secret values.
2. Determine whether the request is local implementation, a Git push, a preview deployment or a production release. Carry out the authorized work; building locally does not by itself authorize domain changes or a production launch.
3. Reuse the existing project and selected team. A GitHub repository, a Vercel deployment and a Git-triggered deployment connection are three separate states; verify each before reporting it as complete.

## Keep publication deliberate

- Use typed content collections for projects, articles and project updates. Validate required metadata, identifiers, references, supported URLs and image alt text.
- Treat missing draft flags as unpublished when that is the site's policy. Filter publication consistently across detail pages, navigation, homepage cards, RSS and sitemap output.
- Decide what happens to content attached to a draft project; an appropriate default is to keep dependent updates and articles unpublished too. Make broken references actionable build errors.
- Keep empty collections honest. Hide empty promotional sections and provide useful direct-link empty states.
- Keep approved design examples outside real content collections and feeds. Mark them visibly and disable them for final launch. Never present demo dates, companies or projects as genuine activity.
- Treat MDX as executable trusted source. Review imports and components like application code.

## Build and verify

Use the repository's actual commands and supported Node version. Do not add a database, CMS, tracking or client framework without a requirement.

Read [references/release-checks.md](references/release-checks.md) for checks covering content, responsive behavior, metadata and infrastructure failures. Run checks proportionate to the change; a documentation-only update does not require a full site build.

## Publish to GitHub

1. Check the intended owner, repository, visibility, remote and current branch. Preserve the user's visibility choice. If it conflicts with an explicit privacy requirement, resolve that conflict before uploading.
2. Inspect the files to commit. Exclude credentials, local auth state, dependency folders, generated build output and private fixtures. Preserve the lockfile and needed source assets.
3. For a new repository, use a supported creation tool or authenticated CLI. If creation is denied, report that exact capability failure; do not repeatedly retry or request tokens in chat. An empty repository created by the user may still permit pushing with the existing integration.
4. Fetch existing remote history before pushing. Preserve remote work; never force-push simply to make a first upload succeed.
5. Push the intended commit, then compare the remote branch SHA with the local commit. Report CI separately as pending, passed or failed.

## Publish to Vercel

1. Verify team, project, source commit, build settings and target environment. Respect the distinction between production and preview protection.
2. Prefer an established Git integration. When an authorized temporary file deployment is needed, package a fresh snapshot of the intended source and assets; exclude local secrets and caches. Do not silently reuse stale in-memory source files from an earlier deployment.
3. Reuse an existing unlinked project rather than creating a duplicate to obtain Git integration. Use a supported linking mechanism and verify the connection; a successful Git push alone does not establish it.
4. Keep temporary previews unindexed, with canonicals based on their configured origin. Noindex is not access control. Do not change DNS or enable permanent-domain indexing until launch is authorized.
5. Wait for the deployment to reach a terminal state, then verify the actual intended alias, not just the build URL. Check that the changed behavior or asset is served.

## Handoff

Report the repository/branch/commit, deployment URL and status, checks performed and any concrete blocker. State explicitly if Git automation or the permanent domain remains unconnected. Never describe a submitted build, running CI job or attempted push as a verified success.
