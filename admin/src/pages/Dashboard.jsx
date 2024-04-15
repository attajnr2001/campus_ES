import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { Outlet } from "react-router-dom";
import PageLink from "../components/PageLink";
import { TaskAlt, HowToReg, VerifiedUser } from "@mui/icons-material";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalVoters = async () => {
      try {
        const votersCollection = collection(db, "voters");
        const votersSnapshot = await getDocs(votersCollection);
        setTotalVoters(votersSnapshot.size);
      } catch (error) {
        console.error("Error fetching total voters:", error);
      }
    };

    const fetchTotalCandidates = async () => {
      try {
        const candidatesCollection = collection(db, "candidates");
        const candidatesSnapshot = await getDocs(candidatesCollection);
        setTotalCandidates(candidatesSnapshot.size);
      } catch (error) {
        console.error("Error fetching total candidates:", error);
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        setTotalUsers(usersSnapshot.size);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalVoters();
    fetchTotalCandidates();
    fetchTotalUsers();
  }, []);

  return (
    <div className="dashboard">
      <div className="widget">
        <PageLink
          text="TOTAL VOTERS"
          count={totalVoters}
          icon={<HowToReg sx={{ color: "#ffebcd", fontSize: 64 }} />}
        />
        <PageLink
          text="TOTAL CANDIDATES"
          count={totalCandidates}
          icon={<TaskAlt sx={{ color: "#ffebcd", fontSize: 64 }} />}
        />
        <PageLink
          text="TOTAL USERS"
          count={totalUsers}
          icon={<VerifiedUser sx={{ color: "#ffebcd", fontSize: 64 }} />}
        />
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
