import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { Outlet } from "react-router-dom";
import PageLink from "../components/PageLink";
import { TaskAlt, HowToReg, VerifiedUser } from "@mui/icons-material";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const unsubscribeVoters = onSnapshot(
      collection(db, "voters"),
      (snapshot) => {
        setTotalVoters(snapshot.size);
      }
    );

    const unsubscribeCandidates = onSnapshot(
      collection(db, "candidates"),
      (snapshot) => {
        setTotalCandidates(snapshot.size);
      }
    );

    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setTotalUsers(snapshot.size);
    });

    return () => {
      unsubscribeVoters();
      unsubscribeCandidates();
      unsubscribeUsers();
    };
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
