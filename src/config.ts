// Central site-wide metadata and environment switches.
export const site = {
	name: "Rikard Ekstam",
	title: "Rikard Ekstam — In progress",
	description:
		"Technology, design and the things I build. A personal workbench for projects, experiments and lessons along the way.",
	github: "https://github.com/RikardEkstam",
	permanentUrl: "https://rikardekstam.com",
	indexable: import.meta.env.SITE_INDEXABLE === "true",
	designPreview:
		import.meta.env.DESIGN_PREVIEW !== "false" &&
		import.meta.env.SITE_INDEXABLE !== "true",
};
