import {project} from '$stores/projectStore';

export async function load() {
  project.getCurrentProjects();
}
