import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { AuthContext } from "./context/AuthContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import NavLinkLayout from "./layouts/NavLinkLayout ";
import VotersList from "./components/VotersList";
import CandidatesList from "./components/CandidatesList";
import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";
import ElectionResult from "./components/ElectionResult";
import AddCandidate from "./components/AddCandidate";
import AddVoter from "./components/AddVoter";

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
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="admin" element={<RootLayout />}>
                <Route
                  path="election-results"
                  element={
                    <RequireAuth>
                      <ElectionResult />
                    </RequireAuth>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                >
                  <Route
                    path=""
                    element={
                      <RequireAuth>
                        <NavLinkLayout />
                      </RequireAuth>
                    }
                  >
                    <Route path="voters">
                      <Route
                        index
                        element={
                          <RequireAuth>
                            <VotersList />
                          </RequireAuth>
                        }
                      />
                      <Route
                        path="add-voter"
                        element={
                          <RequireAuth>
                            <AddVoter />
                          </RequireAuth>
                        }
                      />
                    </Route>
                    <Route path="candidates">
                      <Route
                        index
                        element={
                          <RequireAuth>
                            <CandidatesList />
                          </RequireAuth>
                        }
                      />
                      <Route
                        path="add-candidate"
                        element={
                          <RequireAuth>
                            <AddCandidate />
                          </RequireAuth>
                        }
                      />
                    </Route>
                    <Route path="users">
                      <Route
                        index
                        element={
                          <RequireAuth>
                            <UsersList />
                          </RequireAuth>
                        }
                      />
                      <Route
                        path="add-user"
                        element={
                          <RequireAuth>
                            <AddUser />
                          </RequireAuth>
                        }
                      />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
