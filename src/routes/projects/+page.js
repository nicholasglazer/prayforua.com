import {project} from '$stores/projectStore';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

const ini = initializeApp(firebaseKeys);
const db = getFirestore(ini);
export async function load() {
  project.getCurrentProjects();
  const querySnapshot = await getDocs(collection(db, 'projects'));
  const projects = querySnapshot.docs.reduce(async (acc, d) => {
    const docRef = doc(db, 'users', d.data().creatorId);
    const docSnap = await getDoc(docRef);
    acc[d.id] = {
      project: d.data(),
      creator: docSnap.data()
    };
    return acc;
  }, {});

  return {projects};
}
