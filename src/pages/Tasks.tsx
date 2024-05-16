import { useParams } from 'react-router-dom';
import './Tasks.css';
import { Task } from '../model/Task';
import { useState } from 'react';

export default function Tasks() {
  const { storyId } = useParams();
  console.log(storyId);
  const [tasks, setTasks] = useState<Task[]>(
    JSON.parse(localStorage.getItem('tasks') || '[]')
  );
  const filterTasks = tasks.filter(task => task.userStoryId === storyId);

  console.log(filterTasks);

  return (
    <div>
      <h2>Tasks</h2>
      <p>User story id: {storyId}</p>

      {filterTasks.map((task, index) => (
        <div key={index}>
          <p>{task.name}</p>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
}
