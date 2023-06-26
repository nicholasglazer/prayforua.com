import {writable} from 'svelte/store';
import {browser} from '$app/environment';
import isMobile from '$lib/utils/isMobile';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

import {
  getAuth,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth';

const initialState = {
  isNewUser: false,
  isAuthenticated: false,
  providerId: null,
  user: null,
  flow: {
    user: null,
    profile: null
  }
};

function createAuth(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  const {subscribe, update} = writable(initialValue);
  const ini = initializeApp(firebaseKeys);
  const auth = getAuth(ini);

  return {
    subscribe,
    googleSignIn: async () => {
      const provider = new GoogleAuthProvider();
      try {
        if (isMobile) {
          const result = await signInWithRedirect(auth, provider);
          const {isNewUser, profile, providerId} =
            getAdditionalUserInfo(result);
          update((prev) => ({
            ...prev,
            user: {...profile},
            isNewUser,
            providerId,
            isAuthenticated: true
          }));
        } else {
          const result = await signInWithPopup(auth, provider);
          const {isNewUser, profile, providerId} =
            getAdditionalUserInfo(result);
          update((prev) => ({
            ...prev,
            user: {...profile},
            isNewUser,
            providerId,
            isAuthenticated: true
          }));
        }
      } catch (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }
    },
    googleSignOut: async () => {
      try {
        signOut(auth);
        update((prev) => ({
          ...prev,
          isAuthenticated: false,
          user: {},
          providerId: null
        }));
      } catch (error) {
        console.error('Google sign-out error:', error);
        throw error;
      }
    },
    assignFlowAccount: (payload) => {
      update((prev) => ({
        ...prev,
        flow: {
          ...prev.flow,
          user: payload
        }
      }));
    },
    assignFlowProfile: (payload) => {
      update((prev) => ({
        ...prev,
        flow: {
          ...prev.flow,
          profile: payload
        }
      }));
    },
    unauthenticateFlowAccount: () => {
      update((prev) => ({
        ...prev,
        flow: {
          user: null,
          profile: null
        }
      }));
    },
    useLocalStorage: () => {
      subscribe((current) => {
        if (browser) {
          localStorage.setItem(key, JSON.stringify(current));
        }
      });
    }
  };
}

export const auth = createAuth('app-auth');
