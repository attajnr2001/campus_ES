import { useContext, useEffect, useState } from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  Typography,
  IconButton,
  Modal,
  Box,
  TextField,
  Snackbar,
  Button,
} from "@mui/material";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import "../styles/navbar.css";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [image, setUserImg] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleSaveTimes = async () => {
    try {
      // Validate start time is not greater than end time
      if (new Date(startTime) >= new Date(endTime)) {
        console.error("Start time must be before end time");
        return;
      }

      // Validate start time is not less than today
      const today = new Date();
      if (new Date(startTime) < today) {
        console.error("Start time must not be in the past");
        return;
      }

      const electionDocRef = doc(db, "election", "v0LZEXnaRwqUKPUDl2FP");
      await updateDoc(electionDocRef, {
        startTime: startTime,
        endTime: endTime,
      });
      setSnackbarOpen(true); // Open the snackbar
      handleCloseModal();
    } catch (error) {
      console.error("Error updating start and end times:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (currentUser) {
        try {
          const usersCollection = collection(db, "users");
          const usersQuery = query(
            usersCollection,
            where("email", "==", currentUser.email)
          );
          const usersSnapshot = await getDocs(usersQuery);

          usersSnapshot.forEach((adminDoc) => {
            const userData = adminDoc.data();
            // Assuming you have a field named 'img' in your admin collection
            setUserImg(userData.image);
          });
        } catch (error) {
          console.error("Error fetching admin info:", error);
        }
      }
    };

    fetchUserInfo();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: "LOGOUT" });
      setAnchorEl(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="wrapper">
          <Typography sx={{ fontWeight: "bold" }}>Campus Election</Typography>
          <div className="items">
            <div className="item">
              <Link to="election-results" className="icon-link">
                <InsertChartOutlinedIcon className="icon" />
              </Link>
            </div>
            <div className="item">
              <AccessTimeIcon className="icon" onClick={handleOpenModal} />
            </div>
            <div className="item">
              <IconButton onClick={handleMenuOpen}>
                {image ? (
                  <Avatar src={image} alt="Admin Avatar" className="avatar" />
                ) : (
                  <Avatar
                    className="avatar"
                    src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                  >
                    {/* You can use an initial letter or placeholder image here */}
                  </Avatar>
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {" "}
                <MenuItem>
                  {currentUser && (
                    <>
                      <Typography variant="body2" color="textSecondary">
                        {currentUser.email}
                      </Typography>
                    </>
                  )}
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="time-modal"
          aria-describedby="time-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center", // Center align the content
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Set Election Times
            </Typography>
            <Box sx={{ my: 2 }}>
              <TextField
                id="start-time"
                label="Start Time"
                type="datetime-local"
                value={startTime}
                onChange={handleStartTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth // Make the text field take full width
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                id="end-time"
                label="End Time"
                type="datetime-local"
                value={endTime}
                onChange={handleEndTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth // Make the text field take full width
              />
            </Box>
            <Button
              onClick={handleSaveTimes}
              variant="contained"
              color="primary"
              fullWidth // Make the button take full width
            >
              Save
            </Button>
          </Box>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message="Start Time and End Time updated successfully!"
        />
      </div>
    </>
  );
};

export default Navbar;
