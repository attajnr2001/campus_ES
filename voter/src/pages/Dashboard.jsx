import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import {
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton, // Import IconButton component
  Fab,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material"; // Import VisibilityIcon

const Dashboard = () => {
  const [voterData, setVoterData] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [candidatesByPosition, setCandidatesByPosition] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility

  const nextSlide = () => {
    const candidateGroups = document.querySelectorAll(".candidate-group");
    const windowHeight = window.innerHeight;
    const currentScrollPosition = window.scrollY;
    const nextScrollPosition = currentScrollPosition + windowHeight;
    window.scrollTo({
      top: nextScrollPosition,
      behavior: "smooth",
    });
  };

  const prevSlide = () => {
    const windowHeight = window.innerHeight;
    const currentScrollPosition = window.scrollY;
    const prevScrollPosition = currentScrollPosition - windowHeight;
    window.scrollTo({
      top: prevScrollPosition,
      behavior: "smooth",
    });
  };

  const handleDeselectCandidate = (position) => {
    setSelectedCandidates((prevSelectedCandidates) => {
      const updatedSelectedCandidates = { ...prevSelectedCandidates };
      delete updatedSelectedCandidates[position];
      console.log("Deselected candidate at position:", position);
      return updatedSelectedCandidates;
    });
  };

  const handleSubmitVoting = async () => {
    try {
      const storedVoterData = JSON.parse(localStorage.getItem("user"));
      const currentUserIndexNumber = storedVoterData.indexNumber;

      if (!currentUserIndexNumber) {
        console.error("Current user's index number not found.");
        return;
      }

      const votersRef = collection(db, "voters");
      const voterQuery = query(
        votersRef,
        where("indexNumber", "==", currentUserIndexNumber)
      );
      const voterSnapshot = await getDocs(voterQuery);

      if (!voterSnapshot.empty) {
        const voterDoc = voterSnapshot.docs[0];
        const voterDocumentData = voterDoc.data(); // Rename this variable

        console.log("Voter document data:", voterDocumentData);

        if (!voterDocumentData.hasVoted) {
          // Debugging: Log selectedCandidates
          console.log("Selected candidates:", selectedCandidates);

          // Update votes count for selected candidates
          for (const position in selectedCandidates) {
            const candidateId = selectedCandidates[position];
            const candidateDocRef = doc(db, "candidates", candidateId);

            await updateDoc(candidateDocRef, {
              votes: increment(1),
            });
          }

          // Update hasVoted field to true
          await updateDoc(doc(db, "voters", voterDoc.id), {
            hasVoted: true,
          });

          setAlertMessage("Voted successfully!");
          setOpenAlert(true);
          console.log("Voted successfully!");
        } else {
          setAlertMessage("Voter has already voted.");
          setOpenAlert(true);
          console.log("Voter has already voted.");
        }
      } else {
        console.error("Voter document not found.");
      }
    } catch (error) {
      console.error("Error updating voting status: ", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Retrieve voter data from LocalStorage or context here (based on your implementation)
      const storedVoterData = JSON.parse(localStorage.getItem("user"));
      setVoterData(storedVoterData);
    } else {
      setVoterData(null); // Clear voter data if not logged in
    }
  }, [auth.currentUser]);

  useEffect(() => {
    const storedVoterData = JSON.parse(localStorage.getItem("user"));
    console.log("Stored Voter Data:", storedVoterData);
    setVoterData(storedVoterData);
  }, []);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const candidatesRef = collection(db, "candidates");
        const candidatesSnapshot = await getDocs(candidatesRef);

        // Extracting candidate data from the snapshot
        const candidatesData = candidatesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Group candidates by position
        const groupedCandidates = {};
        candidatesData.forEach((candidate) => {
          if (!groupedCandidates[candidate.Position]) {
            groupedCandidates[candidate.Position] = [];
          }
          groupedCandidates[candidate.Position].push(candidate);
        });

        // Set candidates grouped by position
        setCandidatesByPosition(groupedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const handleCandidateSelection = (position, candidateId) => {
    setSelectedCandidates((prevSelectedCandidates) => {
      const updatedSelectedCandidates = {
        ...prevSelectedCandidates,
        [position]: candidateId,
      };
      console.log("Updated selected candidates:", updatedSelectedCandidates);
      return updatedSelectedCandidates;
    });
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const showSelectedCandidates = () => {
    setOpenDialog(true);
  };

  return (
    <div className="dashboard">
      <div className="candidate-groups">
        {Object.keys(candidatesByPosition).map((position, index) => (
          <div
            key={index}
            className={`candidate-group ${position.toLowerCase()}`}
          >
            <h3>{position}</h3>
            <ul className="no-flex">
              {candidatesByPosition[position].map((candidate, idx) => (
                <li
                  key={idx}
                  className={
                    selectedCandidates[candidate.Position] === candidate.id
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    handleCandidateSelection(candidate.Position, candidate.id)
                  }
                >
                  <div className="contents">
                    <img
                      src={candidate.image}
                      alt={`Candidate ${candidate.firstName}`}
                    />
                    <span>
                      {candidate.firstName} {candidate.lastName}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeselectCandidate(position)}
            >
              Deselect
            </Button>
          </div>
        ))}
      </div>

      <div className="buttons">
        <Button variant="outlined" color="secondary" onClick={prevSlide}>
          Previous
        </Button>
        <Button variant="outlined" color="secondary" onClick={nextSlide}>
          Next
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleSubmitVoting}
        >
          Submit
        </Button>
      </div>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity={alertMessage.includes("successfully") ? "success" : "error"}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Selected Candidates</DialogTitle>
        <DialogContent>
          <ul>
            {Object.keys(selectedCandidates).map((position, index) => (
              <li key={index}>
                <strong>{position}: </strong>
                {
                  candidatesByPosition[position].find(
                    (candidate) => candidate.id === selectedCandidates[position]
                  ).firstName
                }{" "}
                {
                  candidatesByPosition[position].find(
                    (candidate) => candidate.id === selectedCandidates[position]
                  ).lastName
                }
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        onClick={showSelectedCandidates}
        size="small"
        sx={{ position: "fixed", bottom: "20px", right: "20px" }}
      >
        <VisibilityIcon />
      </Fab>
    </div>
  );
};

export default Dashboard;
