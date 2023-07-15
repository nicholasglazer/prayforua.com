import {project} from '$stores/projectStore';
import {
  collection,
  getDocs,
  getDoc,
  where,
  query,
  getFirestore
} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

export async function load({params}) {
  project.getCurrentProjects();
  // //
  // const ini = initializeApp(firebaseKeys);
  // const db = getFirestore(ini);

  // const projectsIds = await getDoc('state', 'projCont');
  // const q = query(
  //   collection(db.getDbRef(), 'projects'),
  //   where('id', 'in', projectsIds.data()[get(auth).user.id])
  // );
  // const querySnapshot = getDocs(q);
  // // querySnapshot.forEach((doc) => {
  // //   update((prev) => ({
  // //     ...prev,
  // //     projects: {
  // //       ...prev.projects,
  // //       ...(!prev.projects[doc.id] && {[doc.id]: doc.data()})
  // //     },
  // //     currentProjectsStatus: true
  // //   }));
  // // });
  // return {projects: querySnapshot};
}
