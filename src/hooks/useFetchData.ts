import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { projectDatabase } from '../firebase/config';

export function useFetchData<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    setIsPending(true);
    setError(null);

    const unsubscribe = onSnapshot(
      collection(projectDatabase, collectionName),
      snapshot => {
        if (snapshot.empty) {
          setError(new Error('No data found'));
          setIsPending(false);
          return;
        } else {
          const data = setData(
            snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              data.id = id;
              return data;
            }) as T[]
          );
          setIsPending(false);
        }
      },
      (error: Error) => {
        setError(error);
        setIsPending(false);
      }
    );

    // Cleanup function to unsubscribe from the snapshot on unmount
    return () => unsubscribe();
  }, [collectionName]);

  return { data, error, isPending };
}
