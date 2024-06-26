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
  Checkbox,
  Toolbar,
  alpha,
  Tooltip,
  TablePagination,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

interface TaskListProps {
  data: Task[];
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function Row(props: {
  row: Task;
  isSelected: (id: string) => boolean;
  index: number;
  handleClick: (event: React.MouseEvent<unknown>, id: string) => void;
}) {
  const { row, isSelected, index, handleClick } = props;
  const [open, setOpen] = React.useState(false);

  const isItemSelected = isSelected(row.id);
  const labelId = `enhanced-table-checkbox-${index}`;

  return (
    <React.Fragment>
      <TableRow
        hover
        onClick={event => handleClick(event, row.id)}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}
        sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
          />
        </TableCell>
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

        <TableCell>{row.startDate.toDate().toLocaleDateString()}</TableCell>
        <TableCell>{row.createDate.toDate().toLocaleDateString()}</TableCell>
        <TableCell>
          {row.expectedEndDate
            ? row.expectedEndDate.toDate().toLocaleDateString()
            : 'N/A'}
        </TableCell>
        <TableCell>
          {row.endDate ? row.endDate.toDate().toLocaleDateString() : 'N/A'}
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
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Task>('id');

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for row selection
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleEdit = (task: Task) => {
    // setSelectedTask(task);
  };

  const handleAdd = () => {
    // Add logic to add a new task
  };

  useEffect(() => {
    setTasks(data);
  }, [data]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Task
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = tasks.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(tasks, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  interface HeadCell {
    disablePadding: boolean;
    id: keyof Task;
    label: string;
    numeric: boolean;
  }

  const headCells: readonly HeadCell[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name',
    },
    {
      id: 'priority',
      numeric: true,
      disablePadding: false,
      label: 'Priority',
    },
    {
      id: 'expectedEndDate',
      numeric: true,
      disablePadding: false,
      label: 'Expected End Date',
    },
    {
      id: 'createDate',
      numeric: true,
      disablePadding: false,
      label: 'Create Date',
    },
    {
      id: 'startDate',
      numeric: true,
      disablePadding: false,
      label: 'Start Date',
    },
    {
      id: 'endDate',
      numeric: true,
      disablePadding: false,
      label: 'End Date',
    },
    {
      id: 'state',
      numeric: true,
      disablePadding: false,
      label: 'State',
    },
  ];

  interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (
      event: React.MouseEvent<unknown>,
      property: keyof Task
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
  }

  function EnhancedTableHead(props: EnhancedTableProps) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler =
      (property: keyof Task) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
      };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
          {headCells.map(headCell => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}>
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  interface EnhancedTableToolbarProps {
    numSelected: number;
  }

  function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: theme =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}>
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div">
            Nutrition
          </Typography>
        )}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />

        <TableContainer component={Paper}>
          <Table aria-label="collapsible table" sx={{ minWidth: 750 }}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tasks.length}
            />
            <TableBody>
              {tasks.map((task, index) => (
                <Row
                  key={index}
                  row={task}
                  isSelected={isSelected}
                  index={index}
                  handleClick={handleClick}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
