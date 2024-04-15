import React from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const Home = () => {
  return (
    <>
      <div className="landing-page">
        <div className="background-image"></div>
        <Container maxWidth="lg">
          <div className="content glass-background">
            <Typography
              variant="h3"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Welcome to the Campus Election Platform
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Your trusted platform for fair and transparent elections!
            </Typography>

            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Home;
