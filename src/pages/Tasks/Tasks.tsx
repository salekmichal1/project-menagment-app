import { useParams } from 'react-router-dom';
import './Tasks.css';
import { Task } from '../../model/Task';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { projectDatabase } from '../../firebase/config';

export default function Tasks() {
  const { storyId } = useParams();

  const [data, setData] = useState<Task[] | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<string | boolean>(false);

  useEffect(() => {
    setIsPending(true);

    const tasksCollection = collection(projectDatabase, 'Tasks');
    const unSub = onSnapshot(
      tasksCollection,
      snapshot => {
        if (snapshot.empty) {
          setError('No tasks found');
          setIsPending(false);
        } else {
          let tasks: Task[] = [];
          snapshot.docs.forEach(doc => {
            if (doc.data().userStoryId.includes(storyId)) {
              tasks.push(doc.data() as Task);
            }
          });
          setData(tasks);
          setIsPending(false);
        }
      },
      error => {
        setError(error.message);
        setIsPending(false);
      }
    );
    return () => unSub();
  }, [storyId]);
  // const [tasks, setTasks] = useState<Task[]>(
  //   JSON.parse(localStorage.getItem('tasks') || '[]')
  // );
  // const filterTasks = tasks.filter(task => task.userStoryId === storyId);

  // console.log(filterTasks);

  console.log(data);

  return (
    <div>
      <h2>Tasks</h2>
      <p>User story id: {storyId}</p>

      {/* {filterTasks.map((task, index) => (
        <div key={index}>
          <p>{task.name}</p>
          <p>{task.description}</p>
        </div>
      ))} */}
    </div>
  );
}
