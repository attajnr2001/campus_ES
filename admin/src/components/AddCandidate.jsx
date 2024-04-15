import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Alert,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  DriveFolderUploadOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddCandidate = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [clientData, setClientData] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    Position: "",
    idNumber: "",
    level: "",
    status: "Active",
    gender: "",
    image: "",
    votes: 0,
  });

  const [file, setFile] = useState(null);
  const [per, setPerc] = useState(null);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      console.log(name);
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "idNumber") {
      const selectedVoter = clientData.find(
        (voter) => voter.indexNumber === value
      );
      if (selectedVoter) {
        updatedData.firstName = selectedVoter.firstName;
        updatedData.lastName = selectedVoter.lastName;
        updatedData.level = selectedVoter.level;
        updatedData.gender = selectedVoter.gender;
      }
    }

    setFormData(updatedData);
  };

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const votersCollection = collection(db, "voters");
        const votersSnapshot = await getDocs(votersCollection);
        const votersData = votersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientData(votersData);
      } catch (error) {
        console.error("Error fetching voters:", error);
        setErrorMessage("Error fetching voters");
      }
    };

    fetchVoters();
  }, []);

  const handleFormSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "candidates"), formData);
      console.log("Candidate added with ID: ", docRef.id);

      setFormData({
        firstName: "",
        lastName: "",
        Position: "",
        idNumber: "",
        level: "",
        status: "Active",
        gender: "",
        image: "",
        votes: 0,
      });

      setSuccessMessage("Candidate added successfully!");
    } catch (error) {
      console.error("Error adding candidate: ", error);
      setErrorMessage("Failed to add candidate. Please try again.");
    }
  };

  return (
    <div className="addVehicle">
      <Box sx={{ width: "100%" }} spacing={2}>
        <Typography
          variant="h4"
          sx={{ color: "#333", fontSize: "1.1em", marginTop: "1em" }}
        >
          Candidate Details
        </Typography>

        <img
          src={
            file
              ? URL.createObjectURL(file)
              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
          }
          alt=""
        />

        <label htmlFor="file">
          Image: <DriveFolderUploadOutlined className="icon" />
        </label>
        <input
          type="file"
          id="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        <TextField
          required
          select
          label="ID Number"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.idNumber}
          onChange={handleChange}
          name="idNumber"
        >
          {clientData.map((voter) => (
            <MenuItem key={voter.id} value={voter.indexNumber}>
              {voter.indexNumber}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          label="First Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.firstName}
          onChange={handleChange}
          name="firstName"
        />
        <TextField
          required
          label="Last Name"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.lastName}
          onChange={handleChange}
          name="lastName"
        />

        <TextField
          required
          select
          label="Position"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.Position}
          onChange={handleChange}
          name="Position"
        >
          {["President", "Secretary", "Organizer"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          select
          label="Level"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.level}
          onChange={handleChange}
          name="level"
        >
          {["100", "200", "300", "400"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          required
          select
          label="Gender"
          value={formData.gender}
          onChange={handleChange}
          name="gender"
          variant="outlined"
          fullWidth
          margin="normal"
          placeholder="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFormSubmit}
          sx={{ marginBottom: "1em" }}
        >
          Add Vehicle
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
      </Box>
    </div>
  );
};

export default AddCandidate;
