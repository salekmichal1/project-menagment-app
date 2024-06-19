import React, { useEffect, useState } from 'react';
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
  Box,
  Typography,
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface TaskListProps {
  data: Task[];
}

function Row(props: { row: Task }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell>{row.priority}</TableCell>
        <TableCell>
          {row.expectedEndDate
            ? row.expectedEndDate.toDate().toLocaleDateString()
            : 'N/A'}
        </TableCell>
        <TableCell>
          {row.expectedEndDate.toDate().toLocaleDateString()}
        </TableCell>
        <TableCell>
          {row.expectedEndDate.toDate().toLocaleDateString()}
        </TableCell>
        <TableCell>
          {row.endDate
            ? row.expectedEndDate.toDate().toLocaleDateString()
            : 'N/A'}
        </TableCell>
        <TableCell>{row.state}</TableCell>
        <TableCell>{row.pinedUser}</TableCell>
        {/* <TableCell>
          <Button onClick={() => handleEdit(task)}>Edit</Button>
        </TableCell> */}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Description
              </Typography>
              <Typography gutterBottom component="div">
                {row.description}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
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
    console.log(
      data.forEach(task =>
        console.log(task.expectedEndDate.toDate().toLocaleDateString())
      )
    );
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <TableSortLabel>Name</TableSortLabel>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <Row key={index} row={task} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
