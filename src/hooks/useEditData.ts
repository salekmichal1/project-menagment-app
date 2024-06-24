import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { projectDatabase } from '../firebase/config';

export function useEditData() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editData = async (collectionName: string, docId: string, data: any) => {
    setIsPending(true);
    setError(null);

    try {
      const docRef = doc(projectDatabase, collectionName, docId);
      await updateDoc(docRef, data);
      setIsPending(false);
    } catch (error: any) {
      setError(error);
      setIsPending(false);
    }
  };
  return { error, isPending, editData };
}
