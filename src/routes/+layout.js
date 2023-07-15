import {browser} from '$app/environment';
import {locale} from '$stores/l10nStore';
import {project} from '$stores/projectStore';
import {auth} from '$stores/authStore';

export async function load() {
  if (browser) {
    auth.useLocalStorage();
    locale.useLocalStorage();
    project.useLocalStorage();
  }
}
