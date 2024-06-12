import { useEffect, useState } from 'react';
import { Task } from '../../model/Task';
import './TaskList.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableSortLabel,
} from '@mui/material';

interface TaskListProps {
  data: Task[];
}

export default function TaskList({ data }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
  };

  const handleAdd = () => {
    // Add logic to add a new task
  };

  useEffect(() => {
    setTasks(data);
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Button onClick={handleAdd}>Add Task</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel>Name</TableSortLabel>
            </TableCell>
            {/* Add more table cells for each property */}
            <TableCell>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.name}>
              <TableCell>{task.name}</TableCell>
              {/* Add more table cells for each property */}
              <TableCell>
                <Button onClick={() => handleEdit(task)}>Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
