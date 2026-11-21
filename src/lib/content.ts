import { getCollection } from "astro:content";

/**
 * Loads the site's content collections and applies the rules that decide
 * whether a piece of content is visible.
 *
 * Draft content is hidden, linked journal entries and updates must belong to
 * a published project, and all public slugs must be simple hyphenated names.
 */
export async function publishedContent() {
	const allProjects = await getCollection("projects");
	const allJournal = await getCollection("journal");
	const allUpdates = await getCollection("updates");
	const allIds = new Set(allProjects.map((p) => p.id));
	for (const entry of [...allProjects, ...allJournal, ...allUpdates]) {
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
			throw new Error(
				`Invalid slug: ${entry.id}. Use a lowercase, hyphenated filename without subdirectories.`,
			);
		}
		if (
			"project" in entry.data &&
			entry.data.project &&
			!allIds.has(entry.data.project.id)
		) {
			throw new Error(
				`Unknown project ${entry.data.project.id} referenced by ${entry.id}.`,
			);
		}
	}
	const projects = allProjects
		.filter((p) => !p.data.draft)
		.sort((a, b) => a.data.order - b.data.order);
	const ids = new Set(projects.map((p) => p.id));
	const journal = allJournal
		.filter(
			(p) => !p.data.draft && (!p.data.project || ids.has(p.data.project.id)),
		)
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
	const updates = allUpdates
		.filter((p) => !p.data.draft && ids.has(p.data.project.id))
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
	return { projects, journal, updates };
}
export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(date);
export const updateUrl = (id: string, projectId: string) =>
	`/projects/${projectId}/#update-${id}`;
