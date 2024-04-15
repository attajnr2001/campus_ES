import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  LabelList,
} from "recharts";
import "../styles/results.css";

const Results = () => {
  const [candidatesData, setCandidatesData] = useState([]);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const groupedCandidates = candidatesData.reduce((acc, candidate) => {
    if (!acc[candidate.Position]) {
      acc[candidate.Position] = [];
    }
    acc[candidate.Position].push(candidate);
    return acc;
  }, {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const candidatesRef = collection(db, "candidates");
        const querySnapshot = await getDocs(candidatesRef);
        const candidates = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCandidatesData(candidates);
      } catch (error) {
        console.error("Error fetching candidates: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="results">
      <h2>Results</h2>
      {Object.entries(groupedCandidates).map(([position, candidates]) => (
        <div key={position} className="chart">
          <h3>{position}</h3>
          <ResponsiveContainer width={700} height="70%">
            <BarChart width={600} height={300} data={candidates}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="firstName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes">
                {candidates.map((candidate, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
                <LabelList
                  dataKey="votes"
                  position="top"
                  formatter={(value) =>
                    `${value} (${(
                      (value /
                        candidates.reduce((acc, c) => acc + c.votes, 0)) *
                      100
                    ).toFixed(2)}%)`
                  }
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default Results;
