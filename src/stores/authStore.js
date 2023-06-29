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
  user: {
    id: '',
    firstName: '',
    lastName: '',
    occupation: '',
    country: '',
    city: '',
    website: '',
    bio: '',
    social: {
      Discord: '',
      Facebook: '',
      Github: '',
      Instagram: '',
      Linkedin: '',
      Telegram: '',
      Twitter: '',
      Youtube: ''
    }
  },
  google: {
    profile: null
  },
  flow: {
    user: null,
    profile: null,
    flowProfileStatus: null
  }
};

function createAuth(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  const {subscribe, set, update} = writable(initialValue);
  const ini = initializeApp(firebaseKeys);
  const auth = getAuth(ini);

  function updateGoogleProfile(result) {
    const {isNewUser, profile, providerId} = getAdditionalUserInfo(result);
    update((prev) => ({
      ...prev,
      google: {profile},
      isNewUser,
      providerId,
      isAuthenticated: true
    }));
    if (isNewUser) {
      update((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          id: profile.id,
          firstName: profile.given_name,
          lastName: profile.family_name
        }
      }));
    }
  }
  return {
    set,
    subscribe,
    googleSignIn: async () => {
      const provider = new GoogleAuthProvider();
      try {
        if (isMobile) {
          const result = await signInWithRedirect(auth, provider);
          updateGoogleProfile(result);
        } else {
          const result = await signInWithPopup(auth, provider);
          updateGoogleProfile(result);
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
          google: {profile: {}},
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
    isFlowProfileCreated: (payload) => {
      update((prev) => ({
        ...prev,
        flow: {
          ...prev.flow,
          flowProfileStatus: payload
        }
      }));
    },
    unauthenticateFlowAccount: () => {
      update((prev) => ({
        ...prev,
        flow: {
          ...prev.flow,
          user: null,
          profile: null
        }
      }));
    },
    updateFlowProfile: (payload) => {
      update((prev) => ({
        ...prev,
        flow: {
          ...prev.flow,
          profile: {
            ...prev.flow.profile,
            ...payload
          }
        }
      }));
    },
    updateUserBaseProfile: (payload) => {
      update((prev) => {
        return {
          ...prev,
          user: {
            ...prev.user,
            ...payload
          }
        };
      });
    },
    updateUserLinks: (payload) => {
      update((prev) => {
        return {
          ...prev,
          user: {
            ...prev.user,
            social: {
              ...prev.user.social,
              ...payload
            }
          }
        };
      });
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
