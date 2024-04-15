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

const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchClients = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [users]);

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
          All Clients
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="add-user"
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
                <TableCell>Address</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Edit</TableCell>{" "}
                {/* Add a new TableCell for Edit button */}
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar alt={user.firstName} src={user.image} />
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.Address}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className={`status ${user.status}`}>
                      {user.status}
                    </TableCell>
                    <TableCell>
                      {/* Add an edit button that links to the edit-user page */}
                      <Button
                        variant="outlined"
                        color="primary"
                        component={Link}
                        to={`edit-user/${user.id}`}
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
            count={users.length}
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

export default UsersList;
