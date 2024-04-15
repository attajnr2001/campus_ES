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
} from "@mui/material";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const VotersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voters, setVoters] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  return (
    <div className="client">
      <div className="header">
        <Typography variant="h6" gutterBottom>
          All Voters
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="add-voter"
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
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>gender</TableCell>
                <TableCell>Index</TableCell>
                <TableCell>Has Voted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edit</TableCell>{" "}
                {/* Add a new TableCell for Edit button */}
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
                      {/* Add an edit button that links to the edit-voter page */}
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`edit-voter/${voter.id}`}
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
    </div>
  );
};

export default VotersList;
