import React from "react";
import Login from "./pages/Login";
import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";

const App = () => {
  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
  });

  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Routes>
            <Route path="/">
              <Route path="login" element={<Login />} />
              <Route path="dashboard" element={<Navbar />}>
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route
                  path="results"
                  element={
                    <RequireAuth>
                      <Results />
                    </RequireAuth>
                  }
                />
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
