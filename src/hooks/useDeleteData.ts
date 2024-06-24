import { useState } from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { projectDatabase } from '../firebase/config';

export function useDeleteData() {
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  const deleteData = async (collectionName: string, id: string) => {
    setIsPending(true);
    setError(null);

    try {
      await deleteDoc(doc(projectDatabase, collectionName, id));
      setIsPending(false);
    } catch (error: any) {
      setError(error);
      setIsPending(false);
    }
  };

  return { deleteData, error, isPending };
}
