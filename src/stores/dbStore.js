import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {writable} from 'svelte/store';
import {browser} from '$app/environment';
import {firebaseKeys} from '$lib/firebase/config';

const initialState = {};

function createDb(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  const {subscribe, set, update} = writable(initialValue);
  const ini = initializeApp(firebaseKeys);
  const db = getFirestore(ini);

  return {
    set,
    update,
    subscribe,
    getDbRef: () => db,
    getDoc: async (path, id) => {
      const docRef = doc(db, path, id);
      return await getDoc(docRef);
    },
    setDoc: async (path, id, payload) => {
      try {
        const docRef = doc(db, path, id);
        await setDoc(docRef, {...payload}, {merge: true});
        console.log('Document added to Firestore:', document);
      } catch (error) {
        console.error('Error adding document to Firestore:', error);
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

export const db = createDb('app-db');
