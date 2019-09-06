import { firestore } from 'firebase';

enum RefType {
  'COLLECTION' = 'collection',
  'DOCUMENT' = 'doc',
}

// Create the function path for string path
export const firestoreFunctionPath = (
  path: string,
  firestoreRef: firestore.Firestore,
): firestore.CollectionReference | firestore.DocumentReference =>
  path
    .split('/')
    .reduce(
      (arr, curr, index) =>
        isEven(index)
          ? arr[RefType.COLLECTION](curr)
          : arr[RefType.DOCUMENT](curr),
      firestoreRef as any,
    );

// Helper
export const isEven = (num: number) => num % 2 === 0;

export const isObject = (obj: any) =>
  typeof obj === 'function' || (typeof obj === 'object' && !!obj);
