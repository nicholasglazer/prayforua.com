import {project} from '$stores/projectStore';
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
  // project.getAllProjects();

  const ini = initializeApp(firebaseKeys);
  const db = getFirestore(ini);

  const querySnapshot = getDocs(collection(db, 'projects'));
  // const allProjects = querySnapshot.docs.reduce(async (acc, d) => {
  //   const docRef = doc(db, 'users', d.data().creatorId);
  //   const docSnap = await getDoc(docRef);
  //   acc[d.id] = {
  //     project: d.data(),
  //     creator: docSnap.data()
  //   };
  //   return acc;
  // }, {});
  return {querySnapshot};
}
