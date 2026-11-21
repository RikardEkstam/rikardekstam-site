# Static-site release checks

Select the checks needed for the change and the repository's existing workflow. Keep test fixtures out of published content.

## Content and build

- Run type/schema checks and a static build with the project's supported runtime.
- For content-pipeline changes, use an isolated fixture containing a published project, article and update; drafts; dependencies on a draft project; and an invalid reference. Verify generated routes, navigation, RSS and sitemap output, not just helper functions.
- Check unique page titles, descriptions, canonical origins and indexability for the environment. Inspect code blocks, tables of contents, copy controls and project links when those features change.
- For launch, confirm demo content is absent and the actual permanent origin appears consistently in metadata and feeds. Do not infer readiness from an environment variable alone.

## Browser verification

- Use the existing browser runner or an ephemeral static fixture serving the exact build output. Close the fixture when tests finish. Keep this distinct from a persistent user-facing preview server.
- Check representative paths at mobile, tablet and desktop widths. Test tall desktop heights as well as short windows: width-only testing misses gaps below the footer.
- Wait for fonts and images, inspect screenshots, check overflow and keyboard interactions, and run available accessibility checks. Visually inspect CSS background images too.
- Local checks establish local behavior. After deployment, verify the intended live alias and changed output separately.

## Diagnose infrastructure accurately

| Observed failure | Appropriate next action |
| --- | --- |
| Shell/network access denied | Use the environment's supported permission mechanism for the specific command. Do not misreport it as invalid service credentials. |
| Cannot bind a local test fixture | Check execution permissions and supported preview/test facilities. Do not open a broader network listener unnecessarily. |
| TLS validation failure in an isolated browser | Preserve certificate validation. Use a working supported browser or test the local build, and state the limits of that verification. |
| Protected Vercel deployment | Use the supported protected-deployment access workflow; do not disable protection to make a test pass. |
| GitHub denies repository creation | Report the missing operation. A user-created empty repo or an authorized supported UI flow may resolve creation; verify push access independently. |
| A repository exists but no new Vercel build appears | Inspect the project's Git connection and branch settings. Repository creation and pushing do not automatically link an existing Vercel project. |
| Managed preview startup fails | Inspect its error and use the supported recovery guidance. Do not call a failed startup a usable preview. |
| Astro writes telemetry outside writable paths | Use `ASTRO_TELEMETRY_DISABLED=1` for the command when applicable; use an npm cache in a permitted writable directory. |

Do not copy account IDs, deployment IDs, paths or environment-specific workarounds from another project without verifying that they apply.
