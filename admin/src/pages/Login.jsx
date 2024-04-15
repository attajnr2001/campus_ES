import React from "react";
import { auth } from "../firebase";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Typography,
  TextField,
  Alert,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate(); // Initialize useNavigate
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      dispatch({ type: "LOGIN", payload: user });
      navigate("/admin/dashboard/voters");
    } catch (error) {
      console.error("Error signing in:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="lg">
      <div className="content login-container">
        <Typography
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Login
        </Typography>
        <TextField
          size="small"
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          size="small"
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          sx={{ marginBottom: "10px" }}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>
        {error && (
          <Alert severity="error">Invalid credentials, Please Try Again</Alert>
        )}
      </div>
    </Container>
  );
};

export default Login;
