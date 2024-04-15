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
} from "@mui/material";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const CandidatesList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  return (
    <div className="client">
      <div className="header">
        <Typography variant="h6" gutterBottom>
          All Candidates
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="add-candidate"
        >
          +
        </Button>
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
                      {/* Add an edit button that links to the edit-candidate page */}
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`edit-candidate/${candidate.id}`}
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
            count={candidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};
export default CandidatesList;
