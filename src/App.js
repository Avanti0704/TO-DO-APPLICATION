import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskManager from "./Layouts/TaskManager";
import PageNotFound from "./Components/PageNotFound";
import { ThemeProvider } from "./Contexts/Theme";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import './App.css';
const App = () => {
  return (
    <ThemeProvider>

      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/all-tasks" element={<TaskManager />} />
          <Route path="/pending-tasks" element={<TaskManager />} />
          <Route path="/completed-tasks" element={<TaskManager />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>

  );
};

export default App;
