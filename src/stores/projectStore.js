import {
  collection,
  getDocs,
  doc,
  where,
  query,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import {writable} from 'svelte/store';
import {browser} from '$app/environment';
import {db} from '$stores/dbStore';
import {auth} from '$stores/authStore';
import {nanoid} from 'nanoid';
import {get} from 'svelte/store';

const initialState = {
  newProject: {
    id: '',
    name: '',
    description: '',
    isPublic: true,
    coverImg: '',
    tags: []
  },
  projects: {}
};

function createProject(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  console.log('initialValue', initialValue);
  const {subscribe, set, update} = writable(initialValue);

  return {
    set,
    update,
    subscribe,
    getCurrentProjects: async () => {
      const projectsIds = await db.getDoc('state', 'projCont');
      const q = query(
        collection(db.getDbRef(), 'projects'),
        where('id', 'in', projectsIds.data()[get(auth).user.id])
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        //doc.data() is never undefined for query doc snapshots
        update((prev) => ({
          ...prev,
          projects: {
            ...prev.projects,
            ...(!prev.projects[doc.id] && {[doc.id]: doc.data()})
          }
        }));
      });
    },
    addProject: (payload) => {
      const id = nanoid();
      db.setDoc('projects', id, {
        ...payload,
        creator: get(auth).user,
        id
      });
      const docRef = doc(db.getDbRef(), 'state/projCont');
      updateDoc(docRef, {
        [get(auth).user.id]: arrayUnion(id)
      });
      update((prev) => ({
        projects: {...prev.projects, [id]: {...payload, id}},
        newProject: initialState.newProject
      }));
    },
    removeProject: async (id) => {
      await deleteDoc(doc(db, 'projects', id));
      const docRef = doc(db.getDbRef(), 'state/projCont');
      updateDoc(docRef, {
        [get(auth).user.id]: arrayRemove(id)
      });
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

export const project = createProject('app-projects');
