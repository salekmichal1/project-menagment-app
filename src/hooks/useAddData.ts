import { useState } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';
import { projectDatabase } from '../firebase/config';

export function useAddData() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const addData = async (collectionName: string, data: any) => {
    setIsPending(true);
    setError(null);
    console.log(data);

    try {
      const docRef = doc(collection(projectDatabase, collectionName));

      const dataWithId = { ...data, id: docRef.id };

      // Set the data on this document, including the auto-generated ID
      await setDoc(docRef, dataWithId);
      setIsPending(false);
      return docRef.id;
    } catch (error: any) {
      setError(error);
      setIsPending(false);
      console.log(error.message);
    }
  };
  return { error, isPending, addData };
}
