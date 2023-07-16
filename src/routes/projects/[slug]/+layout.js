import {getFirestore, doc, getDoc} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

const ini = initializeApp(firebaseKeys);
const db = getFirestore(ini);

// import {project} from '$stores/projectStore';
// import {
//   collection,
//   getDocs,
//   getDoc,
//   doc,
//   getFirestore
// } from 'firebase/firestore';
// import {initializeApp} from 'firebase/app';
// import {firebaseKeys} from '$lib/firebase/config';

// export async function load() {
//   const ini = initializeApp(firebaseKeys);
//   const db = getFirestore(ini);

//   const userSnap = async (id) => {
//     const docRef = doc(db, 'users', id);
//     return getDoc(docRef);
//   };
//   const querySnapshot = getDocs(collection(db, 'projects'));

//   return {
//     querySnapshot,
//     userSnap
//   };
// }

export async function load({params}) {
  const projectSnap = await getDoc(doc(db, 'projects', params.slug));
  const pd = projectSnap.data();
  const creatorSnap = await getDoc(doc(db, 'users', pd?.creatorId));
  return {
    project: pd,
    creator: creatorSnap.data(),
    slug: params.slug
  };
}

export const prerender = false;
