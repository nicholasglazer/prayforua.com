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
import {writable, derived} from 'svelte/store';
import {browser} from '$app/environment';
import {db} from '$stores/dbStore';
import {auth} from '$stores/authStore';
import {nanoid} from 'nanoid';
import {get} from 'svelte/store';
import {debounce} from '$lib/utils/debounce';

const initialState = {
  newProject: {
    id: '',
    name: '',
    description: '',
    country: '',
    isPublic: true,
    coverImg: '',
    goal: 0,
    tags: [],
    links: {
      Discord: '',
      Facebook: '',
      Github: '',
      Instagram: '',
      Linkedin: '',
      Telegram: '',
      Twitter: '',
      Youtube: ''
    },
    paymentLinks: {
      FlowAddr: '',
      Monobank: '',
      Privatbank: ''
    }
  },
  projects: {},
  currentProjectsStatus: false
};

function createProject(key) {
  const initialValue =
    browser && localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : initialState;

  console.log('initialValue', initialValue);
  const {subscribe, set, update} = writable(initialValue);

  const saveCurrentProjectToDb = debounce((prev, payload, id) => {
    db.setDoc('users', id, {
      providerId: prev.providerId,
      user: {
        ...prev.user,
        ...payload
      },
      google: prev.google,
      flow: prev.flow
    });
  }, 7000);

  return {
    set,
    update,
    subscribe,
    getAllProjects: async () => {},
    getCurrentProjects: async () => {
      try {
        const projectsIds = await db.getDoc('state', 'projCont');
        const q = query(
          collection(db.getDbRef(), 'projects'),
          where('id', 'in', projectsIds.data()[get(auth).user.id])
        );
        const querySnapshot = await getDocs(q);
        update((prev) => ({...prev, currentProjectsStatus: false}));
        querySnapshot.forEach((doc) => {
          //doc.data() is never undefined for query doc snapshots
          update((prev) => ({
            ...prev,
            projects: {
              ...prev.projects,
              ...(!prev.projects[doc.id] && {[doc.id]: doc.data()})
            },
            currentProjectsStatus: true
          }));
        });
        console.log('querySnapshot', querySnapshot);
      } catch {
        update((prev) => ({...prev, currentProjectsStatus: null}));
      }
    },
    updateCurrentProject: (payload, id) => {
      update((prev) => {
        saveCurrentProjectToDb(prev, payload, id);
        return {
          ...prev,
          projects: {
            ...prev.projects,
            [id]: {
              ...prev.projects[id],
              ...payload
            }
          }
        };
      });
    },
    addProject: (payload) => {
      const id = nanoid();
      db.setDoc('projects', id, {
        ...payload,
        creatorId: get(auth).user.id,
        id
      });
      const docRef = doc(db.getDbRef(), 'state/projCont');
      updateDoc(docRef, {
        [get(auth).user.id]: arrayUnion(id)
      });
      update((prev) => ({
        projects: {...prev.projects, [id]: {...payload, id}},
        newProject: initialState.newProject,
        currentProjectsStatus: true
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
export const currencyGoal = derived(
  project,
  ($project) => `${$project.newProject.goal} Flow`
);
