import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore
} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

export async function load() {
  const ini = initializeApp(firebaseKeys);
  const db = getFirestore(ini);

  const querySnapshot = getDocs(collection(db, 'projects'));

  const userSnap = async (id) => {
    const docRef = doc(db, 'users', id);
    return getDoc(docRef);
  };

  return {
    querySnapshot,
    userSnap
  };
}
