import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore,
  onSnapshot
} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

export async function load() {
  const ini = initializeApp(firebaseKeys);
  const db = getFirestore(ini);

  const userSnap = async (id) => {
    const docRef = doc(db, 'users', id);
    return onSnapshot(docRef);
  };
  const querySnapshot = getDocs(collection(db, 'projects'));

  return {
    querySnapshot,
    userSnap
  };
}
