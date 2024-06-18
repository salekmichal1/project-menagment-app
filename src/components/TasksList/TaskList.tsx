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
  Collapse,
  IconButton,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface TaskListProps {
  data: Task[];
}

export default function TaskList({ data }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [open, setOpen] = useState(false);

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
  };

  const handleAdd = () => {
    // Add logic to add a new task
  };

  useEffect(() => {
    setTasks(data);
    console.log(
      data.forEach(task =>
        console.log(task.expectedEndDate.toDate().toLocaleDateString())
      )
    );
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
            <TableCell>
              <TableSortLabel>description</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>priority</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>expectedEndDate</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>createDate</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>startDate</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>endDate</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>state</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel>pinedUser</TableSortLabel>
            </TableCell>
            {/* Add more table cells for each property */}
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell>{task.name}</TableCell>
              <TableCell>
                {task.description} vv vuygiyv2uyuy uyg teguygegwg
                gyiuwyugywyguyg gygyugywygryurwyugygrf gyw gfgyuwgyuegyufwyiu
              </TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>
                {task.expectedEndDate
                  ? task.expectedEndDate.toDate().toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {task.expectedEndDate.toDate().toLocaleDateString()}
              </TableCell>
              <TableCell>
                {task.expectedEndDate.toDate().toLocaleDateString()}
              </TableCell>
              <TableCell>
                {task.endDate
                  ? task.expectedEndDate.toDate().toLocaleDateString()
                  : 'N/A'}
              </TableCell>
              <TableCell>{task.state}</TableCell>
              <TableCell>{task.pinedUser}</TableCell>
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
