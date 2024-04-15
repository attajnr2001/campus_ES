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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AddUser = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    Address: "",
    status: "Active",
    image: "",
    email: "",
    password: "",
  });

  const [file, setFile] = useState(null);
  const [per, setPerc] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitButtonState, setSubmitButtonState] = useState({
    disabled: false,
    text: "Add User",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...userData, [name]: value };

    setUserData(updatedData);
  };

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
            setUserData((prev) => ({ ...prev, image: downloadURL }));
          });
        }
      );
    };

    file && uploadFile();
  }, [file]);

  const handleAddUser = async (e) => {
    e.preventDefault();

    setSubmitButtonState({ disabled: true, text: "Adding User..." });

    try {
      const usersCollection = collection(db, "users");

      await addDoc(usersCollection, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        Address: userData.Address,
        status: "Active",
        image: userData.image,
        email: userData.email,
        password: userData.password,
        timestamp: serverTimestamp(),
      });

      const res = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      console.log("User added successfully");
      setSuccessMessage("User added successfully");
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding user: ", error);
      setErrorMessage("Could not add user");
      setSuccessMessage("");

      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        Address: "",
        status: "Active",
        password: "",
        image: "",
      });
    } finally {
      setSubmitButtonState({ disabled: false, text: "Add User" });
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleAddUser} className="form">
        <Stack spacing={2}>
          <Typography
            variant="h4"
            sx={{ color: "#333", fontSize: "1.1em", marginTop: "1em" }}
          >
            Personal Details
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
            fullWidth
            label="email"
            type="email"
            variant="outlined"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            name="password"
            value={userData.password}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="First Name"
            variant="outlined"
            name="firstName"
            value={userData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={userData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            required
            fullWidth
            label="Address"
            variant="outlined"
            name="Address"
            value={userData.Address}
            onChange={handleInputChange}
          />

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

export default AddUser;
