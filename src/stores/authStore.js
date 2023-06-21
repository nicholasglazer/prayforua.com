import {writable} from 'svelte/store';
import {browser} from '$app/environment';
import isMobile from '$utils/isMobile';
import {firebaseKeys} from '$utils/firebaseConfig';
import {
  getAuth,
  signOut,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth';
import {initializeApp} from 'firebase/app';

const initialState = {
  isNewUser: false,
  isAuthenticated: false,
  providerId: null,
  user: {}
};

function createAuth(key) {
  // const initialValue =
  //   browser && localStorage.getItem(key)
  //     ? JSON.parse(localStorage.getItem(key))
  //     : initialState;
  const storedValue = browser ? localStorage.getItem(key) : null;
  const initialValue = storedValue ? JSON.parse(storedValue) : initialState;

  const {subscribe, update} = writable(initialValue);

  return {
    subscribe,
    googleSignIn: async () => {
      const ini = initializeApp(firebaseKeys);
      const auth = getAuth(ini);
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
        await signOut(auth);
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
