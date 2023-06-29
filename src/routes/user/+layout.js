import {browser} from '$app/environment';
import {redirect} from '@sveltejs/kit';

export const load = () => {
  if (browser) {
    const {isAuthenticated} = JSON.parse(localStorage.getItem('app-auth'));
    if (!isAuthenticated) throw redirect(307, '/');
  }
  return;
};
