import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login";
import Register from "./register";
import Home from "./home";
import PomodoroTimer from "./components/pomodoro";
import Tasks from "./components/tasks";
import Profile from "./profile";
import Calendar from "./calendar";
import ProtectedRoute from "./protectedRoute";
import Layout from "./layout"; // Import ProtectedRoute

function App() {
  const [tasks, setTasks] = useState([]); // Shared state for tasks

  const appStyle = {
    backgroundColor: "grey", // Set your background color
    minHeight: "100vh", // Ensures the background covers the entire page
  };

  return (
    <div style={appStyle}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pomodoro"
              element={
                <ProtectedRoute>
                  <PomodoroTimer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <Tasks tasks={tasks} setTasks={setTasks} /> {/* Pass shared state */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Calendar tasks={tasks} /> {/* Pass tasks */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Login />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
