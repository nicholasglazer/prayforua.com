import {writable} from 'svelte/store';
import {browser} from '$app/environment';
import isMobile from '$lib/utils/isMobile';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';
import {deleteDoc, doc, updateDoc} from 'firebase/firestore';
import {debounce} from '$lib/utils/debounce';
import {goto} from '$app/navigation';
import {get} from 'svelte/store';
import {db} from '$stores/dbStore';

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
    },
    other: {
      Monobank: '',
      Privatbank: ''
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
    if (!isNewUser) {
      update((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          id: profile.id,
          firstName: profile.given_name,
          lastName: profile.family_name
        }
      }));
      db.setDoc('users', profile.id, {
        providerId,
        user: {
          ...initialState.user,
          id: profile.id,
          firstName: profile.given_name,
          lastName: profile.family_name
        },
        google: {
          profile
        },
        flow: {
          user: null,
          profile: null,
          flowProfileStatus: null
        }
      });
    }
  }

  const saveBaseProfileToDb = debounce((prev, payload) => {
    db.setDoc('users', prev.user.id, {
      providerId: prev.providerId,
      user: {
        ...prev.user,
        ...payload
      },
      google: prev.google,
      flow: prev.flow
    });
  }, 7000);

  const saveBaseProfileLinksToDb = debounce((prev, payload) => {
    db.setDoc('users', prev.user.id, {
      providerId: prev.providerId,
      user: {
        ...prev.user,
        social: {
          ...prev.user.social,
          ...payload
        }
      },
      google: prev.google,
      flow: prev.flow
    });
  }, 7000);

  return {
    set,
    subscribe,
    googleSignIn: async () => {
      const provider = new GoogleAuthProvider();
      try {
        if (isMobile) {
          const result = await signInWithRedirect(auth, provider);
          updateGoogleProfile(result);
          goto('/user');
        } else {
          const result = await signInWithPopup(auth, provider);
          updateGoogleProfile(result);
          goto('/user');
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
        saveBaseProfileToDb(prev, payload);
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
        saveBaseProfileLinksToDb(prev, payload);
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
    deleteUser: async () => {
      try {
        signOut(auth);
        await deleteDoc(doc(db, 'users', get(auth).user.id));
        const docRef = doc(db.getDbRef(), 'state/projCont');
        updateDoc(docRef, {
          [get(auth).user.id]: []
        });
        set(() => ({
          ...initialState
        }));
      } catch (error) {
        console.error('Google sign-out error:', error);
        throw error;
      }
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
