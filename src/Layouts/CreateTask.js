import React, { useState, useEffect, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, IconButton, Grid, MenuItem, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../assets/styles/createTask.scss";
import ThemeContext from "../Contexts/Theme";
const CreateTask = ({ open, onClose, onSave, task }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status] = useState("Pending");
  const [createdOn, setCreatedOn] = useState(new Date().toLocaleDateString());
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState("");
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState(["Work", "Personal", "Shopping"]);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const { theme } = useContext(ThemeContext);
  const [newTask, setNewTask] = useState({ DueDate: "" });

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setCreatedOn(task.createdOn || new Date().toLocaleDateString());
      setCategory(task.category || "");
      setPriority(task.priority || "");
      setSubtasks(task.subtasks || []);
      setNewSubtask("");
    } else {
      setTitle("");
      setDescription("");
      setCreatedOn(new Date().toLocaleDateString());
      setCategory("");
      setPriority("");
      setSubtasks([]);
      setNewSubtask("");
    }
  }, [task, open]);

  const validateInputs = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!category) {
      newErrors.category = "Category is required";
    }
    if (!priority) {
      newErrors.priority = "Priority is required";
    }
    if (!newTask.DueDate) {
      newErrors.DueDate = "Due date is required";
    }

    return newErrors;
  };

  const handleSave = () => {
    const userId = localStorage.getItem("userId")
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedSubtasks = [...subtasks];
    if (newSubtask.trim()) {
      updatedSubtasks.push(newSubtask.trim());
    }

    const taskData = {
      title,
      description,
      status,
      createdOn,
      category,
      priority,
      subtasks,
      userId: userId,
      dueDate: newTask.DueDate,
    };

    onSave({
      ...task,
      ...taskData,
    });

    setNewSubtask("");
    setNewTask({ DueDate: "" }); // Reset DueDate
    onClose();
  };


  const handleSubtaskChange = (e) => {
    setNewSubtask(e.target.value);
  };

  const handleCategorySave = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
    setNewCategory("");
    setIsCategoryDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        className={`create-task-dialog ${theme}`}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme === "dark" ? "#2c2c2c" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        }}
      >        <DialogTitle>
          {task ? "Edit Task" : "Add Task"}
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="close-icon-button"
            sx={{
              color: theme === "dark" ? "#ffffff" : "#000000",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>

          <TextField
            label="Task Title"
            fullWidth
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, title: "" }));
              }
            }}
            error={!!errors.title}
            helperText={errors.title || " "}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: theme === "dark" ? "#424242" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000",
              },
              "& .MuiInputLabel-root": {
                color: theme === "dark" ? "#aaaaaa" : "#000000",
              },
              "& .MuiFormHelperText-root": {
                color: theme === "dark" ? "#ffffff" : "#000000",
              },
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) {
                setErrors((prev) => ({ ...prev, description: "" }));
              }
            }}
            error={!!errors.description}
            helperText={errors.description || " "}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: theme === "dark" ? "#424242" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000", // Text color inside the input field
              },
              "& .MuiInputLabel-root": {
                color: theme === "dark" ? "#aaaaaa" : "#000000", // Label color
              },
              "& .MuiFormHelperText-root": {
                color: theme === "dark" ? "#ffffff" : "#000000", // Error helper text color
              },
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (e.target.value) {
                    setErrors((prev) => ({ ...prev, category: "" }));
                  }
                }}
                fullWidth
                error={!!errors.category}
                helperText={errors.category || " "}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: theme === "dark" ? "#424242" : "#ffffff",
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  },
                  "& .MuiInputLabel-root": {
                    color: theme === "dark" ? "#aaaaaa" : "#000000",
                  },
                  "& .MuiFormHelperText-root": {
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                <MenuItem value="" disabled>Select Category</MenuItem>

                {categories.map((cat, index) => (

                  <MenuItem key={index} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={() => setIsCategoryDialogOpen(true)}
                className="manage-categories Button"
                variant="contained"
                color="secondary"
                sx={{
                  backgroundColor: theme === "dark" ? "#555555" : "#e0e0e0",
                  color: theme === "dark" ? "#ffffff" : "#000000",
                }}
              >
                Add Category
              </Button>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Priority"
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  if (e.target.value) {
                    setErrors((prev) => ({ ...prev, priority: "" }));
                  }
                }}
                fullWidth
                error={!!errors.priority}
                helperText={errors.priority || " "}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: theme === "dark" ? "#424242" : "#ffffff",
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  },
                  "& .MuiInputLabel-root": {
                    color: theme === "dark" ? "#aaaaaa" : "#000000",
                  },
                  "& .MuiFormHelperText-root": {
                    color: theme === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                <MenuItem value="" disabled>Select Priority</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <span className="due-date">Due Date </span>
              <TextField
                fullWidth
                type="date"
                className="textfield-orange"
                value={newTask.DueDate}
                onChange={(e) => {
                  setNewTask({ ...newTask, DueDate: e.target.value });
                  if (errors.DueDate) setErrors({ ...errors, DueDate: "" });
                }}
                error={!!errors.DueDate}
                helperText={errors.DueDate || " "}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Created On" value={createdOn} disabled fullWidth sx={{
                marginTop: "8%", "& .MuiInputBase-root": {
                  backgroundColor: theme === "dark" ? "#424242" : "#ffffff",
                  color: theme === "dark" ? "#fff" : "#000000",
                },
                "& .MuiInputLabel-root": {
                  color: theme === "dark" ? "#aaaaaa" : "#000000",
                },
                "& .MuiFormHelperText-root": {
                  color: theme === "dark" ? "#fff" : "#000000",
                },
              }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="default">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="secondary" className="Button" sx={{
            backgroundColor: theme === "dark" ? "#555555" : "#e0e0e0",
            color: theme === "dark" ? "#ffffff" : "#000000",
          }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        color="secondary"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme === "dark" ? "#2c2c2c" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          },
        }}
      >
        <DialogTitle>Manage Categories</DialogTitle>
        <DialogContent>
          <TextField
            label="New Category"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: theme === "dark" ? "#424242" : "#ffffff",
                color: theme === "dark" ? "#ffffff" : "#000000", // Text color inside the input field
              },
              "& .MuiInputLabel-root": {
                color: theme === "dark" ? "#aaaaaa" : "#000000", // Label color
              },
              "& .MuiFormHelperText-root": {
                color: theme === "dark" ? "#ffffff" : "#000000", // Error helper text color
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCategoryDialogOpen(false)} variant="contained" color="default" sx={{
            backgroundColor: theme === "dark" ? "#555555" : "#fff",
            color: theme === "dark" ? "#ffffff" : "#000000",
          }}>
            Cancel
          </Button>
          <Button onClick={handleCategorySave} color="secondary" className="Button">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateTask;
