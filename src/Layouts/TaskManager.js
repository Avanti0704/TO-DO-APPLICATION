import React, { useState, useEffect, useContext } from "react";
import Navbar from "../Components/NavHeader";
import MidListOfTask from "./TaskList";
import CreateTask from "./CreateTask";
import Footer from "../Components/Footer";
import { Box, Button, Typography, styled, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { alpha } from "@mui/material/styles";
import "../assets/styles/taskManager.scss";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThemeContext from "../Contexts/Theme";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  border: "1px solid rgba(0, 0, 0, 0.1)",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "50%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [fullName, setFullName] = useState("");
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const token = localStorage.getItem("token");

    if (token) {
      const loggedUser = users.find((user) => token.includes(user.email));
      setFullName(loggedUser ? loggedUser.fullName : "Guest");
    }
  }, []);

  const saveTasksToLocalStorage = (newTasks) => {
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const handleSave = (task) => {
    const userId = localStorage.getItem("userId");
    let updatedTasks;

    if (task.id) {
      updatedTasks = tasks.map((t) => (t.id === task.id ? { ...task, userId } : t));
    } else {
      updatedTasks = [...tasks, { ...task, id: Date.now(), userId }];
    }

    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    setIsFormOpen(false);
  };

  const handleDelete = (task) => {
    const updatedTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchesTab =
        activeTab === 1
          ? task.status === "Pending"
          : activeTab === 2
          ? task.status === "Completed"
          : true;

      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tasks, activeTab, searchQuery]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", height: "100vh" }}
      className={`${theme}`}
    >
      <Typography className="toDO" variant="h6">
        Welcome <b>{fullName}</b> to the Task Management ! 
      </Typography>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} fullName={fullName} />
      <Box sx={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Tasks"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Search>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              className="Button"
              onClick={() => {
                setSelectedTask(null);
                setIsFormOpen(true);
              }}
            >
              Add New Task
            </Button>
            <IconButton onClick={toggleTheme}>
              {theme === "light" ? (
                <WbSunnyIcon />
              ) : (
                <DarkModeIcon sx={{ color: "white" }} />
              )}
            </IconButton>
          </Box>
        </Box>

        <MidListOfTask
          tasks={filteredTasks}
          searchQuery={searchQuery}
          onEdit={(task) => {
            setSelectedTask(task);
            setIsFormOpen(true);
          }}
          onDelete={handleDelete}
          onStatusChange={(task, status) => handleSave({ ...task, status })}
        />

        <CreateTask
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
          task={selectedTask}
        />
      </Box>
      <Footer />
    </Box>
  );
};

export default TaskManager;
