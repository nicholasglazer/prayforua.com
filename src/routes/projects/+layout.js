import {project} from '$stores/projectStore';

export function load() {
  project.getCurrentProjects();
}
