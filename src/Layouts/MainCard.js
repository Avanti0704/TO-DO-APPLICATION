import React, { useState, useContext, useEffect } from "react";
import { Card, CardContent, TextField, Typography, IconButton, Box, Chip, Menu, MenuItem, Dialog, DialogTitle, DialogActions, Button, Modal, LinearProgress } from "@mui/material";
import "../assets/styles/mainCard.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QueryBuilderSharpIcon from "@mui/icons-material/QueryBuilderSharp";
import EditIcon from "@mui/icons-material/Edit";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ThemeContext from "../Contexts/Theme";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const MainCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subtaskDialogOpen, setSubtaskDialogOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [editingIndex, setEditingIndex] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [tasks, setTasks] = useState([]);

  const statusStyles = {
    Completed: { color: "white", backgroundColor: "#4caf50", icon: <CheckCircleIcon /> },
    Active: { color: "white", backgroundColor: "#10bef8", icon: <PlayArrowIcon /> },
    Pending: { color: "white", backgroundColor: "#ff9800", icon: <QueryBuilderSharpIcon /> },
  };

  const { color, backgroundColor, icon } = statusStyles[task.status] || {};
  const progressValue = task.status === "Pending" ? 0 : task.status === "Active" ? 50 : 100;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const userId = localStorage.getItem("userId");
        const userSpecificTasks = storedTasks.filter(
          (task) => task.userId === userId
        );

        setTasks(userSpecificTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleComplete = () => {
    onStatusChange(task, "Completed");
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleMenuClose();
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(task);
    setConfirmOpen(false);
  };
 
  useEffect(() => {
    const storedSubtasks = JSON.parse(localStorage.getItem(`subtasks-${task.id}`)) || [];
    setSubtasks(storedSubtasks);
  }, [task.id]);

  const handleAddSubtask = () => {
    if (newSubtask.trim() === "") return;

    let updatedSubtasks;
    if (editingIndex !== null) {
      updatedSubtasks = [...subtasks];
      updatedSubtasks[editingIndex] = newSubtask;
      setEditingIndex(null);
    } else {
      updatedSubtasks = [...subtasks, newSubtask];
    }
    setSubtasks(updatedSubtasks);
    setNewSubtask("");
    localStorage.setItem(`subtasks-${task.id}`, JSON.stringify(updatedSubtasks));
  };

  const handleEditSubtask = (index) => {
    setEditingIndex(index);
    setNewSubtask(subtasks[index]);
  };

  const handleDeleteSubtask = (index) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);

    localStorage.setItem(`subtasks-${task.id}`, JSON.stringify(updatedSubtasks));
  };


  const handleCloseDialog = () => {
    setSubtaskDialogOpen(false);
    setNewSubtask("");
    setEditingIndex(null);
  };
  const handleStatusMenuOpen = (event) => { setStatusAnchorEl(event.currentTarget); };
  const handleStatusMenuClose = () => { setStatusAnchorEl(null); };
  const handleChangeStatus = (status) => {
    onStatusChange(task, status);
    handleStatusMenuClose();
  };

  const isOverdue = () => {
    if (!task.dueDate) return false;
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      console.error("Invalid due date:", task.dueDate);
      return false;
    }
    return currentDate > dueDate && task.status !== "Completed";
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  };
 
  return (
    <>
      
      <Card
        className={`card-container ${task.status === "Completed" ? "completed" : "pending"} ${theme} `}
      >
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: theme === "dark" ? "#ffffff" : "#000000", }}>
            {task.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, color: theme === "dark" ? "#ffffff" : "#000000", }}>
            {task.description}
          </Typography>
          <Chip
            icon={icon}
            label={task.status}
            size="small"
            sx={{
              mb: 1,
              color: color || "inherit",
              backgroundColor: backgroundColor || "inherit",
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ color: theme === "dark" ? "#ffffff" : "#000000", }} >
            Created On: {formatDate(task.createdOn)}

          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: isOverdue()
                ? "red"
                : theme === "dark"
                  ? "#ffffff"
                  : "#000000",
              fontWeight: isOverdue() ? "bold" : "normal",
            }}
          >
            Due Date: {formatDate(task.dueDate)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            {task.category && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "bold", mr: 2, color: theme === "dark" ? "#ffffff" : "#000000", }}
              >
                Type: {task.category}
              </Typography>
            )}
            {task.priority && (
              <Typography
                variant="body2"
                sx={{
                  fontWeight: "bold",
                  color:
                    task.priority === "High"
                      ? "#B22222"
                      : task.priority === "Medium"
                        ? "#1E90FF"
                        : task.priority === "Low"
                          ? "#FFD700"
                          : "inherit",
                }}
              >
                {task.priority}
              </Typography>
            )}
          </Box>
          <Box sx={{ position: "relative", display: "inline-block", width: "100%", mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{ height: 8, borderRadius: 5 }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 5,
                left: "50%",
                transform: "translateX(-50%) translateY(-50%)",
                fontWeight: "bold",
                color: theme === "dark" ? "#ffffff" : "#000000",
              }}
            >
              {progressValue}%
            </Typography>
          </Box>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={handleStatusMenuOpen} className="change-status-button" variant="contained">
              Change Status <ArrowDropDownIcon className="dropdown-icon" />
            </button>


            <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusMenuClose}>
              <MenuItem onClick={() => handleChangeStatus("Pending")}>Pending</MenuItem>
              <MenuItem onClick={() => handleChangeStatus("Active")}>Active</MenuItem>
            </Menu>

            <button onClick={() => setSubtaskDialogOpen(true)} className="add-subtask-button">+</button>
          </div>

          <Modal
            open={subtaskDialogOpen}
            onClose={handleCloseDialog}
            className={`subtask-modal ${theme === 'dark' ? 'dark-mode' : ''}`}  // Add dark-mode class when theme is dark
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div className="modal-container">
              <div className="modal-header">
                <h2>Add Subtasks</h2>
                <IconButton onClick={handleCloseDialog} className="close-button">
                  <CloseIcon sx={{ color: theme === 'dark' ? '#fff' : '#000' }} />
                </IconButton>
              </div>
              <div className="modal-content">
                <TextField
                  label={editingIndex !== null ? "Edit Subtask" : "Add Subtask"}
                  fullWidth
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="input-field"
                  sx={{
                    input: { color: theme === 'dark' ? '#fff' : '#000' },
                    label: { color: theme === 'dark' ? '#fff' : '#000' },
                  }}
                />
                <ul className="subtask-list">
                  {subtasks.map((subtask, index) => (
                    <li key={index} className="subtask-item">
                      <span className="subtask-text">{subtask}</span>
                      <button onClick={() => handleEditSubtask(index)} className="edit-button">
                        <EditIcon sx={{ color: theme === 'dark' ? '#fff' : '#000' }} />
                      </button>
                      <button onClick={() => handleDeleteSubtask(index)} className="delete-button">
                        <DeleteIcon sx={{ color: theme === 'dark' ? '#fff' : '#000' }} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-actions">
                <Button
                  onClick={handleAddSubtask}
                  className="Button"
                  sx={{
                    backgroundColor: theme === 'dark' ? '#555' : '#1976d2',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: theme === 'dark' ? '#777' : '#1565c0',
                    },
                  }}
                >
                  {editingIndex !== null ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </Modal>
        </CardContent>
        <div className="menu-button">
          {task.status !== "Completed" && (
            <IconButton onClick={handleComplete} size="small" sx={{ marginRight: 1, color: theme === "dark" ? "#ffffff" : "#000000", }}>
              <LibraryAddCheckIcon sx={{ "&:hover": { color: "green" } }} />
            </IconButton>
          )}
          <IconButton onClick={handleMenuOpen} size="small" sx={{ color: theme === "dark" ? "#ffffff" : "#000000", }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              backgroundColor: theme === 'dark' ? '#00000000' : '#ffffff00',
            }}
          >
            <MenuItem
              onClick={handleEdit}
              sx={{
                backgroundColor: theme === 'dark' ? '#444' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                '&:hover': {
                  backgroundColor: theme === 'dark' ? '#555' : '#f0f0f0',
                },
              }}
            >
              <EditIcon
                fontSize="small"
                sx={{
                  marginRight: 1,
                  color: theme === 'dark' ? '#fff' : '#000',
                  '&:hover': { color: theme === 'dark' ? 'lightblue' : 'blue' },
                }}
              />
              Edit
            </MenuItem>
            <MenuItem
              onClick={handleDeleteClick}
              sx={{
                backgroundColor: theme === 'dark' ? '#444' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                '&:hover': {
                  backgroundColor: theme === 'dark' ? '#555' : '#f0f0f0',
                },
              }}
            >
              <DeleteIcon
                sx={{
                  display: 'flex',
                  color: theme === 'dark' ? '#fff' : '#000',
                  '&:hover': { color: 'red' },
                }}
              />
              Delete
            </MenuItem>
          </Menu>

        </div>
      </Card>

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '150px',
            padding: '10px',
            backgroundColor: theme === 'dark' ? '#333' : '#fff',
            color: theme === 'dark' ? '#fff' : '#000',
          },
        }}
      >
        <DialogTitle sx={{ color: theme === 'dark' ? '#fff' : '#000' }}>
          Are you sure you want to delete this <b>  {task.title}</b> task?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={handleConfirmClose}
            variant="contained"
            size="small"
            className="Button"
            sx={{
              backgroundColor: theme === 'dark' ? '#555' : '#1976d2',
              color: '#fff',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#777' : '#1565c0',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="secondary"
            size="small"
            className="Button"
            sx={{
              backgroundColor: theme === 'dark' ? '#777' : '#1976d2',
              color: '#fff',
              '&:hover': {
                backgroundColor: theme === 'dark' ? '#999' : '#1565c0',
              },
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default MainCard;
