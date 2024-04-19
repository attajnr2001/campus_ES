import React, { useState, useEffect } from "react";
import "../styles/list.css";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const VotersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voters, setVoters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const fetchVoters = async () => {
    try {
      const votersCollection = collection(db, "voters");
      const votersSnapshot = await getDocs(votersCollection);
      const votersData = votersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVoters(votersData);
      setLoading(false);
    } catch (error) {
      setError("Error fetching voters");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, [voters]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditStatus = async (voterId, currentStatus) => {
    try {
      const voterDocRef = doc(db, "voters", voterId);
      const newStatus = currentStatus === "Active" ? "InActive" : "Active";
      await updateDoc(voterDocRef, { status: newStatus });
      fetchVoters();
    } catch (error) {
      console.error("Error updating voter status:", error);
    }
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const handleDeleteAllVoters = async () => {
    try {
      const votersCollection = collection(db, "voters");
      const querySnapshot = await getDocs(votersCollection);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      setOpenConfirmation(false);
      fetchVoters();
    } catch (error) {
      console.error("Error deleting all voters:", error);
    }
  };

  return (
    <div className="client">
      <div className="header">
        <Typography variant="h6" gutterBottom>
          All Voters
        </Typography>
        <div className="buttons">
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="add-voter"
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
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>gender</TableCell>
                <TableCell>Index</TableCell>
                <TableCell>Has Voted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {voters
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((voter) => (
                  <TableRow key={voter.id}>
                    <TableCell>{voter.firstName}</TableCell>
                    <TableCell>{voter.lastName}</TableCell>
                    <TableCell>{voter.level}</TableCell>
                    <TableCell>{voter.gender}</TableCell>
                    <TableCell>{voter.indexNumber}</TableCell>
                    <TableCell>{voter.hasVoted ? "Yes" : "No"}</TableCell>
                    <TableCell className={`status ${voter.status}`}>
                      {voter.status}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleEditStatus(voter.id, voter.status)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={voters.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      <Dialog open={openConfirmation} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete all voters?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteAllVoters} color="error">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VotersList;
