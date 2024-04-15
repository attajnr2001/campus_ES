import "../styles/add.css";
import {
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  DriveFolderUploadOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddVoter = () => {
  const [voterData, setVoterData] = useState({
    firstName: "",
    lastName: "",
    appID: "",
    gender: "",
    status: "Active",
    hasVoted: false,
    indexNumber: "",
    level: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitButtonState, setSubmitButtonState] = useState({
    disabled: false,
    text: "Add Voter",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...voterData, [name]: value };

    setVoterData(updatedData);
  };

  const handleAddClient = async (e) => {
    e.preventDefault();

    setSubmitButtonState({ disabled: true, text: "Adding Voter..." });

    try {
      const votersCollection = collection(db, "voters");

      await addDoc(votersCollection, {
        firstName: voterData.firstName,
        lastName: voterData.lastName,
        appID: voterData.appID,
        gender: voterData.gender,
        hasVoted: false,
        status: "Active",
        indexNumber: voterData.indexNumber,
        level: voterData.level,
        timestamp: serverTimestamp(),
      });
      console.log("Voter added successfully");
      setSuccessMessage("Voter added successfully");
      setErrorMessage(""); // Clear any existing error message
    } catch (error) {
      console.error("Error adding voter: ", error);
      setErrorMessage("Could not add voter");
      setSuccessMessage(""); // Clear any existing success message

      setVoterData({
        firstName: "",
        lastName: "",
        appID: "",
        gender: "",
        hasVoted: false,
        status: "Active",
        indexNumber: "",
        level: "",
      });
    } finally {
      setSubmitButtonState({ disabled: false, text: "Add Voter" });
    }
  };

  return (
    <div className="addClient">
      <form onSubmit={handleAddClient} className="form">
        <Stack spacing={2}>
          <Typography
            variant="h4"
            sx={{ color: "#333", fontSize: "1.1em", marginTop: "1em" }}
          >
            Personal Details
          </Typography>

          <TextField
            required
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={voterData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={voterData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="Index Number"
            variant="outlined"
            name="indexNumber"
            value={voterData.indexNumber}
            onChange={handleInputChange}
          />

          <TextField
            required
            fullWidth
            label="Applicant Id"
            variant="outlined"
            name="appID"
            value={voterData.appID}
            onChange={handleInputChange}
          />

          <TextField
            required
            select
            label="Gender"
            value={voterData.gender}
            onChange={handleInputChange}
            name="gender"
            variant="outlined"
            fullWidth
            placeholder="Gender"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          <TextField
            required
            select
            label="Year"
            value={voterData.level}
            onChange={handleInputChange}
            name="level"
            variant="outlined"
            fullWidth
            placeholder="Level"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <MenuItem key={index} value={2021 + index}>
                {2021 + index}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={submitButtonState.disabled}
          >
            {submitButtonState.text}
          </Button>
          {successMessage && (
            <Alert
              severity="success"
              iconMapping={{
                success: <CheckCircleOutline fontSize="inherit" />,
              }}
            >
              {successMessage}
            </Alert>
          )}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        </Stack>
      </form>
    </div>
  );
};

export default AddVoter;
