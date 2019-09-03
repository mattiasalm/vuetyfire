import { firestore } from 'firebase';

// Create the function path for string path
const firestoreFunctionPath = (
  path: string,
  firestoreRef: firestore.Firestore
): firestore.CollectionReference | firestore.DocumentReference =>
  path
    .split('/')
    .reduce(
      (arr, curr, index) =>
        isEven(index) ? arr['collection'](curr) : arr['doc'](curr),
      firestoreRef as any
    );

// Helper
const isEven = (num: number) => num % 2 === 0;

const isObject = (obj: any) =>
  typeof obj === 'function' || (typeof obj === 'object' && !!obj);

export { firestoreFunctionPath, isEven, isObject };
