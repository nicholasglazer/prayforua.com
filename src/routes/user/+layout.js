import {project} from '$stores/projectStore';

export async function load({params}) {
  project.getCurrentProjects();
}
