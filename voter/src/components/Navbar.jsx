import React, { useContext } from "react";
import "../styles/navbar.css";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AccessTime, InsertChartOutlined, Logout } from "@mui/icons-material";

const Navbar = () => {
  const { dispatch } = useContext(AuthContext); // Access the dispatch function from AuthContext

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <>
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link
              to="/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              SUCCESS
            </Link>
          </Typography>
          <div className="items">
            <IconButton component={Link} to="results" color="inherit">
              <InsertChartOutlined />
            </IconButton>
            <Button variant="outlined" color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>

      <Outlet />
    </>
  );
};

export default Navbar;
