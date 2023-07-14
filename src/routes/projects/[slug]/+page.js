import {map, pipe, toPairs, prop, flatten} from 'ramda';
import {getFirestore, doc, getDoc} from 'firebase/firestore';
import {initializeApp} from 'firebase/app';
import {firebaseKeys} from '$lib/firebase/config';

const ini = initializeApp(firebaseKeys);
const db = getFirestore(ini);

export async function entries() {
  const res = await getDoc(doc(db, 'state', 'projCont'));
  return pipe(
    toPairs,
    map(prop(1)),
    flatten,
    map((slug) => ({slug}))
  )(res.data());
}

export const prerender = true;
