import React, { useState, useMemo, useEffect } from 'react';
import { Task } from '../../model/Task';
import './TaskList.css';
import ModalForm from '../ModalForm/ModalForm';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useAddData } from '../../hooks/useAddData';
import { useEditData } from '../../hooks/useEditData';
import { useDeleteData } from '../../hooks/useDeleteData';
import { useAuthContext } from '../../hooks/useAuthContext';
import dayjs from 'dayjs';

interface TaskListProps {
  data: Task[];
  userStoryId: string;
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

function Row(props: {
  row: Task;
  isSelected: (id: string) => boolean;
  index: number;
  handleClick: (event: React.MouseEvent<unknown>, id: string) => void;
  handleEdit: (task: Task) => void;
}) {
  const { row, isSelected, index, handleClick, handleEdit } = props;
  const [open, setOpen] = React.useState(false);

  const isItemSelected = isSelected(row.id);
  const labelId = `enhanced-table-checkbox-${index}`;

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.id}
        selected={isItemSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            onClick={event => {
              handleClick(event, row.id);
            }}
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
        <TableCell>
          <IconButton
            onClick={() =>
              handleEdit({
                id: row.id,
                name: row.name,
                description: row.description,
                priority: row.priority,
                startDate: row.startDate,
                createDate: row.createDate,
                expectedEndDate: row.expectedEndDate,
                endDate: row.endDate,
                state: row.state,
                pinedUser: row.pinedUser,
                userStoryId: row.userStoryId,
              })
            }>
            <EditIcon />
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
    numeric: false,
    disablePadding: false,
    label: 'Priority',
  },
  {
    id: 'startDate',
    numeric: true,
    disablePadding: false,
    label: 'Start Date',
  },
  {
    id: 'createDate',
    numeric: true,
    disablePadding: false,
    label: 'Create Date',
  },
  {
    id: 'expectedEndDate',
    numeric: true,
    disablePadding: false,
    label: 'Expected End Date',
  },
  {
    id: 'endDate',
    numeric: true,
    disablePadding: false,
    label: 'End Date',
  },
  {
    id: 'state',
    numeric: false,
    disablePadding: false,
    label: 'State',
  },
  {
    id: 'pinedUser',
    numeric: false,
    disablePadding: false,
    label: 'Pined User',
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
        <TableCell style={{ width: '34px' }} />
        <TableCell style={{ width: '34px' }} />
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            // align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  hamdleDelete: () => void;
  setShowModal: (showModal: boolean) => void;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, hamdleDelete, setShowModal } = props;

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
          <IconButton onClick={hamdleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add">
          <IconButton onClick={() => setShowModal(true)}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function TaskList({ data, userStoryId }: TaskListProps) {
  const { state } = useAuthContext();
  const { addData, error: addErr, isPending: addPending } = useAddData();
  const { editData, error: editErr, isPending: editPending } = useEditData();
  const {
    deleteData,
    error: deleteErr,
    isPending: deletePending,
  } = useDeleteData();
  const [showModal, setShowModal] = useState<boolean>(false);

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<keyof Task>('id');

  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // State for row selection
  const [selected, setSelected] = useState<string[]>([]);

  // State for edit project
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleDelete = () => {
    console.log(selected);
    selected.forEach(id => {
      deleteData('Tasks', id);
    });
    setSelected([]);
  };

  const handleClose = () => {
    setShowModal(false);
    setTaskToEdit(null);
  };

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
      const newSelected = data.map(n => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

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
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows = useMemo(
    () =>
      // stableSort(tasks, getComparator(order, orderBy)).slice(
      //   page * rowsPerPage,
      //   page * rowsPerPage + rowsPerPage
      // ),
      data
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, data]
  );

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            hamdleDelete={handleDelete}
            setShowModal={setShowModal}
          />

          <TableContainer component={Paper}>
            <Table aria-label="collapsible table" sx={{ minWidth: 750 }}>
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => (
                  <Row
                    key={index}
                    row={row}
                    isSelected={isSelected}
                    index={index}
                    handleClick={handleClick}
                    handleEdit={handleEdit}
                  />
                ))}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{
                        height: 33 * emptyRows,
                      }}
                    />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      {showModal && (
        <ModalForm
          fields={[
            {
              name: 'name',
              label: 'Task name',
              initialValue: taskToEdit ? taskToEdit.name : '',
              type: 'text',
            },
            {
              name: 'description',
              label: 'Task description',
              initialValue: taskToEdit ? taskToEdit.description : '',
              type: 'text',
            },
            {
              name: 'priority',
              label: 'Task priority',
              initialValue: taskToEdit ? taskToEdit.priority : 'Low',
              type: 'select',
              options: [
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
              ],
            },
            {
              name: 'expectedEndDate',
              label: 'Expected End Date',
              initialValue: taskToEdit
                ? dayjs(taskToEdit.expectedEndDate.toDate())
                : dayjs(new Date()),
              type: 'date',
            },
            {
              name: 'startDate',
              label: 'Expected Start Date',
              initialValue: taskToEdit
                ? dayjs(taskToEdit.startDate.toDate())
                : dayjs(new Date()),
              type: 'date',
            },
            {
              name: 'state',
              label: 'Userstory state',
              initialValue: taskToEdit ? taskToEdit.state : 'Todo',
              type: 'select',
              options: [
                { value: 'Todo', label: 'Todo' },
                { value: 'In progress', label: 'In progress' },
                { value: 'Done', label: 'Done' },
              ],
            },
          ]}
          onSubmit={values => {
            if (taskToEdit === null) {
              // adding here because we don't have the id of the project at this point

              addData('Tasks', {
                name: values.name,
                priority: values.priority,
                expectedEndDate: new Date(values.expectedEndDate),
                createDate: new Date(),
                startDate: new Date(values.startDate),
                endDate: null,
                state: values.state,
                description: values.description,
                pinedUser: `${state.user?.name} ${state.user?.surname}`,
                userStoryId: userStoryId,
              });

              setShowModal(false);
            }

            if (taskToEdit !== null) {
              editData('Tasks', taskToEdit.id, {
                id: taskToEdit.id,
                name: values.name,
                priority: values.priority,
                expectedEndDate: new Date(values.expectedEndDate),
                createDate: new Date(),
                startDate: new Date(values.startDate),
                endDate: null,
                state: values.state,
                description: values.description,
                pinedUser: `${state.user?.name} ${state.user?.surname}`,
                userStoryId: userStoryId,
              });

              handleClose();
            }
          }}
          onReset={handleClose}
        />
      )}
    </div>
  );
}
