import "../styles/login.css";
import {
  Container,
  Typography,
  TextField,
  Alert,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useContext, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [indexNumber, setIndexNumber] = useState("");
  const [password, setPassword] = useState("");
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate();
  const [isIndexConfirmed, setIsIndexConfirmed] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const handleConfirmIndexNumber = async () => {
    try {
      // Query the voters collection to find a document with the matching index number
      const votersCollection = collection(db, "voters");
      const indexNumberQuery = query(
        votersCollection,
        where("indexNumber", "==", indexNumber)
      );
      const indexNumberSnapshot = await getDocs(indexNumberQuery);

      // Check if there is a match
      if (!indexNumberSnapshot.empty) {
        // If a document with the matching index number is found, set index confirmation to true
        setIsIndexConfirmed(true);
      } else {
        // If no match is found, display an error or handle it accordingly
        console.log("Index number not found");
        // You can set an error state here if you want to display an error message to the user
      }
    } catch (error) {
      console.error("Error confirming index number:", error);
      // Handle error
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true when login

    try {
      const votersCollection = collection(db, "voters");
      const indexNumberQuery = query(
        votersCollection,
        where("indexNumber", "==", indexNumber)
      );
      const indexNumberSnapshot = await getDocs(indexNumberQuery);
      const voterData = indexNumberSnapshot.docs[0].data();

      if (!indexNumberSnapshot.empty) {
        const voterData = indexNumberSnapshot.docs[0].data();

        if (password === voterData.appID) {
          // Dispatch LOGIN action here after successful authentication
          dispatch({ type: "LOGIN", payload: voterData }); // Assuming voterData contains necessary user information
          navigate("/dashboard");
        } else {
          setError(true);
        }
      } else {
        // If no match is found, display an error or handle it accordingly
        console.log("Index number not found");
        // You can set an error state here if you want to display an error message to the user
      }
    } catch (error) {
      console.error("Error signing in:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div maxWidth="lg" className="container">
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
          label="Index Number"
          type="indexNumber"
          fullWidth
          margin="normal"
          variant="outlined"
          value={indexNumber}
          onChange={(e) => setIndexNumber(e.target.value)}
        />
        {isIndexConfirmed && ( // Show password field only if index is confirmed
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
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        <Button
          sx={{ marginBottom: "10px" }}
          variant="contained"
          color="primary"
          fullWidth
          onClick={isIndexConfirmed ? handleLogin : handleConfirmIndexNumber} // Change button action based on index confirmation
        >
          {isIndexConfirmed // Change button text based on index confirmation
            ? loading
              ? "Logging In..."
              : "Login"
            : "Confirm Index Number"}
        </Button>
        {error && (
          <Alert severity="error">Invalid credentials, Please Try Again</Alert>
        )}
      </div>
    </div>
  );
};

export default Login;
