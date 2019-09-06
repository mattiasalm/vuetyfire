import { firestore } from 'firebase';
import { vuetyfireData } from '../data';
import { firestoreFunctionPath, isObject } from '../util';

interface SetOptions {
  data: { [key: string]: any };
  path: string;
  merge?: boolean;
}

interface DeleteOptions {
  path: string;
}

const createFirestoreDataRef = (path: string) => {
  if (!vuetyfireData.firebase) {
    return;
  }

  const firestoreRef: firestore.Firestore = vuetyfireData.firebase
    .firestore as firestore.Firestore;
  return firestoreFunctionPath(path, firestoreRef);
};

export const setFirestoreDocument = ({ data, path, merge }: SetOptions): Promise<void> => {
  const firestoreDataRef = createFirestoreDataRef(path);
  if (!firestoreDataRef) {
    return Promise.reject();
  }
  if (!isObject(data)) {
    return Promise.reject();
  }

  if (!('where' in firestoreDataRef)) {
    return firestoreDataRef.set({ ...data }, { merge });
  }

  return Promise.reject();
};

export const addFirestoreDocument = ({ data, path }: SetOptions): Promise<void> => {
  const firestoreDataRef = createFirestoreDataRef(path);
  if (!firestoreDataRef) {
    return Promise.reject();
  }
  if (!isObject(data)) {
    return Promise.reject();
  }

  if ('where' in firestoreDataRef) {
    return firestoreDataRef
      .add({ ...data })
      .then((docRef: firestore.DocumentReference) => {
        const id = docRef.id;
        return docRef.set({ id }, { merge: true });
      })
      .catch(err => {
        throw new Error(err);
      });
  }

  return Promise.reject();
};

export const deleteFirestoreDocument = ({ path }: DeleteOptions): Promise<void> => {
  const firestoreDataRef = createFirestoreDataRef(path);
  if (!firestoreDataRef) {
    return Promise.reject();
  }

  if (!('where' in firestoreDataRef)) {
    return firestoreDataRef.delete();
  }

  return Promise.reject();
};
