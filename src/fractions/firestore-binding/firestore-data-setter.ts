import { firestore } from 'firebase';
import vueFirebaseData from '../data';
import { firestoreFunctionPath, isObject } from '../util';

interface SetOptions {
  data: { [key: string]: any };
  path: string;
}

interface DeleteOptions {
  path: string;
}

const createFirestoreDataRef = (path: string) => {
  if (!vueFirebaseData.vueFirebase) {
    return;
  }

  const firestoreRef: firestore.Firestore = vueFirebaseData.vueFirebase
    .firestore as firestore.Firestore;
  return firestoreFunctionPath(path, firestoreRef);
};

const setFirestoreDocument = ({ data, path }: SetOptions) => {
  const firestoreDataRef = createFirestoreDataRef(path);
  if (!firestoreDataRef) {
    return;
  }
  if (!isObject(data)) {
    return;
  }

  if (!('where' in firestoreDataRef)) {
    firestoreDataRef.set({ ...data });
  }
};

const addFirestoreDocument = ({ data, path }: SetOptions) => {
  const firestoreDataRef = createFirestoreDataRef(path);
  if (!firestoreDataRef) {
    return;
  }
  if (!isObject(data)) {
    return;
  }

  if ('where' in firestoreDataRef) {
    firestoreDataRef
      .add({ ...data })
      .then((docRef: firestore.DocumentReference) => {
        const id = docRef.id;
        docRef.set({ id }, { merge: true });
      })
      .catch(err => {
        throw new Error(err);
      });
  }
};

const deleteFirestoreDocument = ({ path }: DeleteOptions) => {
  const firestoreDataRef = createFirestoreDataRef(path);
  if (!firestoreDataRef) {
    return;
  }

  if (!('where' in firestoreDataRef)) {
    firestoreDataRef.delete();
  }
};

export { setFirestoreDocument, deleteFirestoreDocument, addFirestoreDocument };
