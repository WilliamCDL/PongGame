import { redirect } from '@sveltejs/kit';
import { authStore } from '../../stores/authStore';
// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in production
export const prerender = true;


export function load() {

    authStore.subscribe((value) => {
        if (!value.isAuth) {
            throw redirect(302, '/');
        }
    });
    
}