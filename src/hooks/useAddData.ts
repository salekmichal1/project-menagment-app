import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { projectDatabase } from '../firebase/config';

export function useAddData() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const addData = async (collectionName: string, data: any) => {
    setIsPending(true);
    setError(null);

    try {
      const docRef = await addDoc(
        collection(projectDatabase, collectionName),
        data
      );
      setIsPending(false);
      return docRef.id;
    } catch (error: any) {
      setError(error);
      setIsPending(false);
    }
  };
  return { error, isPending, addData };
}
