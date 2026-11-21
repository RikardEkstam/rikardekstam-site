import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Shared fields used by every content type.
const base = {
	title: z.string().min(1),
	description: z.string().min(1),
	draft: z.boolean().default(true),
};

// Projects are the main work units and can optionally be featured on the homepage.
const projects = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
	schema: z
		.object({
			...base,
			status: z.enum(["exploring", "building", "released", "paused"]),
			featured: z.boolean().default(false),
			order: z.number().default(0),
			tags: z.array(z.string()).default([]),
			image: z.string().optional(),
			imageAlt: z.string().optional(),
			links: z
				.array(
					z.object({ label: z.string(), url: z.url({ protocol: /^https?$/ }) }),
				)
				.default([]),
		})
		.refine((data) => !data.image || Boolean(data.imageAlt), {
			message: "Project images need imageAlt.",
		}),
});

// Journal entries are long-form articles; project references are optional.
const journal = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/journal" }),
	schema: z.object({
		...base,
		date: z.coerce.date(),
		updated: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		project: reference("projects").optional(),
	}),
});

// Updates are short project logs and always require a project reference.
const updates = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/updates" }),
	schema: z.object({
		...base,
		date: z.coerce.date(),
		project: reference("projects"),
	}),
});
export const collections = { projects, journal, updates };
