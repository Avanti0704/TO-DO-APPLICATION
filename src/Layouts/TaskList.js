import React, { useState, useEffect, useContext } from "react";
import { Grid, Typography, IconButton, Menu, MenuItem, Divider, ThemeProvider } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MainCard from "./MainCard";
import ImgBack from "../assets/images/remover.png";
import Img from "../assets/images/remove.png";
import "../assets/styles/midListOfTask.scss";
import ThemeContext from "../Contexts/Theme";
const MidListOfTask = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const { theme } = useContext(ThemeContext);
  const userId = localStorage.getItem("userId");

  const openFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const closeFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    closeFilterMenu();
  };

  const handlePrioritySort = (priority) => {
    setSelectedPriority(priority);
    closeFilterMenu();
  };

  useEffect(() => {
    let userSpecificTasks = tasks.filter((task) => task.userId === userId);

    if (searchQuery) {
      userSpecificTasks = userSpecificTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      userSpecificTasks = userSpecificTasks.filter(
        (task) => task.category === selectedCategory
      );
    }

    if (selectedPriority) {
      userSpecificTasks = userSpecificTasks.filter(
        (task) => task.priority === selectedPriority
      );
    }

    setFilteredTasks(userSpecificTasks);
  }, [tasks, searchQuery, selectedCategory, selectedPriority, userId]);

  return (
    <>
      <div style={{ textAlign: "right", marginBottom: "1rem" }} className={`${theme}`}>
        <IconButton
          onClick={openFilterMenu}
          variant="contained"
          style={{
            backgroundColor: "#9c27b0",
            color: "white",
            borderRadius: "50%",
          }}
        >
          <DragIndicatorIcon />
        </IconButton>
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={closeFilterMenu}
          className={`filter-menu ${theme}`}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: theme === "dark" ? "#333333" : "#ffffff",
            },
          }}
        >
          <Typography className="filter-header" sx={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>
            Filter by Category
          </Typography>
          <Divider className="divider" sx={{ backgroundColor: theme === "dark" ? "#555555" : "#e0e0e0" }} />

          <MenuItem
            className="filter-item"
            onClick={() => handleCategoryFilter("Work")}
            sx={{
              backgroundColor: theme === "dark" ? "#424242" : "#f5f5f5",
              color: theme === "dark" ? "#ffffff" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#616161" : "#e0e0e0",
              },
            }}
          >
            Work
          </MenuItem>

          <MenuItem
            className="filter-item"
            onClick={() => handleCategoryFilter("Personal")}
            sx={{
              backgroundColor: theme === "dark" ? "#424242" : "#f5f5f5",
              color: theme === "dark" ? "#ffffff" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#616161" : "#e0e0e0",
              },
            }}
          >
            Personal
          </MenuItem>

          <MenuItem
            className="filter-item"
            onClick={() => handleCategoryFilter("Shopping")}
            sx={{
              backgroundColor: theme === "dark" ? "#424242" : "#f5f5f5",
              color: theme === "dark" ? "#ffffff" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#616161" : "#e0e0e0",
              },
            }}
          >
            Shopping
          </MenuItem>

          <Typography className="filter-header" sx={{ color: theme === "dark" ? "#ffffff" : "#000000" }}>
            Sort by Priority
          </Typography>
          <Divider className="divider" sx={{ backgroundColor: theme === "dark" ? "#555555" : "#e0e0e0" }} />

          <MenuItem
            className="filter-item"
            onClick={() => handlePrioritySort("High")}
            sx={{
              backgroundColor: theme === "dark" ? "#424242" : "#f5f5f5",
              color: theme === "dark" ? "#ffffff" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#616161" : "#e0e0e0",
              },
            }}
          >
            High
          </MenuItem>

          <MenuItem
            className="filter-item"
            onClick={() => handlePrioritySort("Medium")}
            sx={{
              backgroundColor: theme === "dark" ? "#424242" : "#f5f5f5",
              color: theme === "dark" ? "#ffffff" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#616161" : "#e0e0e0",
              },
            }}
          >
            Medium
          </MenuItem>

          <MenuItem
            className="filter-item"
            onClick={() => handlePrioritySort("Low")}
            sx={{
              backgroundColor: theme === "dark" ? "#424242" : "#f5f5f5",
              color: theme === "dark" ? "#ffffff" : "#000000",
              "&:hover": {
                backgroundColor: theme === "dark" ? "#616161" : "#e0e0e0",
              },
            }}
          >
            Low
          </MenuItem>
        </Menu>
      </div>
      {filteredTasks.length === 0 ? (
        <Typography textAlign="center">
          <img
            src={Img}
            alt="No tasks available"
            className="no-tasks-image"
          />
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
              <MainCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};


export default MidListOfTask;

