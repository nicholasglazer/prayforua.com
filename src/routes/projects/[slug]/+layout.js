import {getFirestore, doc, getDoc} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

const ini = initializeApp(firebaseKeys);
const db = getFirestore(ini);

export async function load({params}) {
  const docSnap = await getDoc(doc(db, 'projects', params.slug));
  return {
    ...docSnap.data()
  };
}
