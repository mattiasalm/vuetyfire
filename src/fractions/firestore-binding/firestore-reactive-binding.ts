import {
  bindCollection,
  bindDocument,
  OperationsType,
  walkSet,
} from '@posva/vuefire-core';
import { firestore } from 'firebase'
import { firestoreFunctionPath } from '../util';
import Vue from 'vue';
import vueFirebaseData from '../data';

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
  set: (target, path, value) => walkSet(target, path, value),
  add: (array, index, data) => array.splice(index, 0, data),
  remove: (array, index) => array.splice(index, 1),
};

const bindFirestorePath = ({
  vm,
  key,
  path,
  resolve,
  reject,
}: FirestorePathOptions) => {
  if (!vueFirebaseData.vueFirebase) return;
  if (!vm || !path || !key) return;

  const firestoreRef: firestore.Firestore = vueFirebaseData.vueFirebase
    .firestore as firestore.Firestore;
  const firestoreDataRef:
    | firestore.CollectionReference
    | firestore.DocumentReference = firestoreFunctionPath(
    path,
    firestoreRef
  );

  const defaultResolveReject = (_?: any) => {};

  const bindOptions: CommonBindOptions = {
    vm,
    key,
    ops,
    resolve: resolve || defaultResolveReject,
    reject: reject || defaultResolveReject,
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

export { bindFirestorePath };
