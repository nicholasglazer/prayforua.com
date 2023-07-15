import {getFirestore, doc, getDoc} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

const ini = initializeApp(firebaseKeys);
const db = getFirestore(ini);

export async function load({params}) {
  const projectSnap = await getDoc(doc(db, 'projects', params.slug));
  const creatorSnap = await getDoc(
    doc(db, 'users', projectSnap.data().creatorId)
  );
  return {
    project: projectSnap.data(),
    creator: creatorSnap.data()
  };
}
