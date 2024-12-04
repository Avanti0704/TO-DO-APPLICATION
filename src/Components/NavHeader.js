import React, { useEffect, useState, useContext } from "react";
import { AppBar, Toolbar, Tabs, Tab, Typography, MenuItem, IconButton, Menu, Divider, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/styles/navHeader.scss";
import AccountCircle from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeContext from "../Contexts/Theme";
const Navbar = ({ activeTab, setActiveTab }) => {
  const [fullName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const routes = ["/all-tasks", "/pending-tasks", "/completed-tasks"];
  const currentTab = routes.indexOf(location.pathname);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { theme, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (currentTab !== -1 && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [currentTab, activeTab, setActiveTab]);
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const token = localStorage.getItem("token");

    if (token) {
      const loggedUser = users.find((users) => token.includes(users.email));
      setUserName(loggedUser ? loggedUser.fullName : "Guest");
      setEmail(loggedUser ? loggedUser.email : "Guest");

    }
  }, []);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(routes[newValue]);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    navigate("/");
    handleClose();
  };
  return (
    <AppBar position="static" color="secondary" className={`nav-main ${theme}`}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Tabs
          className="tab-margin"
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="white"
          textColor="white"
        >
          <Tab label="All Tasks" />
          <Tab label="Pending Tasks" />
          <Tab label="Completed Tasks" />
        </Tabs>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            cursor: "pointer",
          }}
          onClick={handleClick}
        >
          <AccountCircle
            sx={{ height: "3ch", width: "4ch", color: "white", marginRight: "8px" }}
          />
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: "bold" }}>
            {fullName}
          </Typography>
        </div>
        <Menu
          className={theme === "dark" ? "menu-dark" : "menu-light"} // Dynamically set the class
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem>
            <Typography variant="body1" disabled>
              Profile
            </Typography>
          </MenuItem>
          <MenuItem>
            <Box display="flex" alignItems="center">
              <AccountCircle style={{ marginRight: 8 }} />
              <Typography variant="body1">{email}</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Box display="flex" alignItems="center">
              <LogoutIcon style={{ marginRight: 8, color: "red" }} />
              <Typography variant="body1" style={{ color: "red" }}>
                Logout
              </Typography>
            </Box>
          </MenuItem>
        </Menu>



      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 