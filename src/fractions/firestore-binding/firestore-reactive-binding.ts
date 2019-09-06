import {
  bindCollection,
  bindDocument,
  OperationsType,
  walkSet,
} from '@posva/vuefire-core';
import { firestore } from 'firebase';
import Vue from 'vue';
import { vuetyfireData } from '../data';
import { firestoreFunctionPath } from '../util';

interface CommonOptions {
  vm: Vue;
  key: string;
}

interface FirestorePathOptions extends CommonOptions {
  path: string;
  resolve?: (value?: any) => void;
  reject?: (error: any) => void;
}

interface CommonBindOptions extends CommonOptions {
  ops: OperationsType;
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}

interface CollectionBindOptions extends CommonBindOptions {
  collection: firestore.CollectionReference;
}

interface DocumentBindOptions extends CommonBindOptions {
  document: firestore.DocumentReference;
}

const ops: OperationsType = {
  add: (array, index, data) => array.splice(index, 0, data),
  remove: (array, index) => array.splice(index, 1),
  set: (target, path, value) => walkSet(target, path, value),
};

export const bindFirestorePath = ({
  vm,
  key,
  path,
  resolve,
  reject,
}: FirestorePathOptions) => {
  if (!vuetyfireData.firebase) {
    return;
  }
  if (!vm || !path || !key) {
    return;
  }

  const firestoreRef: firestore.Firestore = vuetyfireData.firebase
    .firestore as firestore.Firestore;
  const firestoreDataRef:
    | firestore.CollectionReference
    | firestore.DocumentReference = firestoreFunctionPath(path, firestoreRef);

  const defaultResolveReject = (_?: any) => undefined;

  const bindOptions: CommonBindOptions = {
    key,
    ops,
    reject: reject || defaultResolveReject,
    resolve: resolve || defaultResolveReject,
    vm,
  };

  if ('where' in firestoreDataRef) {
    const opts: CollectionBindOptions = Object.assign(bindOptions, {
      collection: firestoreDataRef,
    });
    return bindCollection(opts);
  } else {
    const opts: DocumentBindOptions = Object.assign(bindOptions, {
      document: firestoreDataRef,
    });
    return bindDocument(opts);
  }
};
