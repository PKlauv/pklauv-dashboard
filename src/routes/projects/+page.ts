import { getProjects } from '$lib/projects';

export async function load() {
	const projects = await getProjects();
	return { projects };
}
