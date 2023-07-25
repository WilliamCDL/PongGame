import { writable } from 'svelte/store';
import type { User } from '../user/definitions/User';

export const baseUrl = 'http://localhost:3000/api';

export interface AuthStore {
    isAuth: boolean;
    user?: User;
}

export interface PostUserResponse {
    message?: string;
    data?: User;
    error?: string;
}

// Create a writable store with a default value
export const authStore = writable<AuthStore>({
    isAuth: false,
});


export const login = async (user: User) => {
    // POST to API
    const response = await fetch(`${baseUrl}/login`,
        {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        });

    const body: PostUserResponse = await response.json();

    if (body.error) {
        throw new Error(body.error);
    }

    // if success, update authStore
    authStore.update((store) => {
        return {
            ...store,
            isAuth: true,
            user: body.data
        };
    });
}


export const register = async (user: User) => {
    // POST to API
    console.log(user);
    const response = await fetch(`${baseUrl}/users`,
        {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        });

    const body: PostUserResponse = await response.json();

    if (body.error) {
        throw new Error(body.error);
    }

    // If success, update authStore
    if (body.message == 'success') {
        authStore.update((store) => {
            return {
                ...store,
                isAuth: true,
                user
            };
        });
    }

    return body.message;
}

export const logout = () => {
    authStore.update((store) => {
        return {
            ...store,
            isAuth: false,
            user: undefined
        };
    });
}