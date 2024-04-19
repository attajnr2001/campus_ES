import "../styles/list.css";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  TablePagination,
  TableContainer,
  TableHead,
  Table,
  TableCell,
  TableRow,
  TableBody,
  CircularProgress,
  Paper,
  Avatar,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const CandidatesList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const fetchClients = async () => {
    try {
      const candidatesCollection = collection(db, "candidates");
      const candidatesSnapshot = await getDocs(candidatesCollection);
      const candidatesData = candidatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCandidates(candidatesData);
      setLoading(false);
    } catch (error) {
      setError("Error fetching candidates");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [candidates]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await deleteDoc(doc(db, "candidates", candidateId));
      // Remove the deleted candidate from the state
      setCandidates(
        candidates.filter((candidate) => candidate.id !== candidateId)
      );
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  const handleDeleteAllCandidates = async () => {
    try {
      const candidatesCollection = collection(db, "candidates");
      const querySnapshot = await getDocs(candidatesCollection);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setOpenConfirmation(false);
      fetchClients();
    } catch (error) {
      console.error("Error deleting all candidates:", error);
    }
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  return (
    <div className="client">
      <div className="header">
        <Typography variant="h6" gutterBottom>
          All Candidates
        </Typography>

        <div className="buttons">
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="add-candidate"
          >
            +
          </Button>
          <Button
            variant="outlined"
            color="error"
            sx={{ marginLeft: "1em" }}
            onClick={handleOpenConfirmation}
          >
            -
          </Button>
        </div>
      </div>
      {loading ? (
        <CircularProgress style={{ margin: "20px" }} />
      ) : error ? (
        <Typography variant="body1" color="error" style={{ margin: "20px" }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Index</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Votes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edit</TableCell>{" "}
                {/* Add a new TableCell for Edit button */}
              </TableRow>
            </TableHead>
            <TableBody>
              {candidates
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <Avatar alt={candidate.firstName} src={candidate.image} />
                    </TableCell>
                    <TableCell>{candidate.firstName}</TableCell>
                    <TableCell>{candidate.lastName}</TableCell>
                    <TableCell>{candidate.idNumber}</TableCell>
                    <TableCell>{candidate.Position}</TableCell>
                    <TableCell>{candidate.votes}</TableCell>
                    <TableCell className={`status ${candidate.status}`}>
                      {candidate.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteCandidate(candidate.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={candidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      />

      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete all candidates?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAllCandidates} color="error">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default CandidatesList;
