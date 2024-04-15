import React from "react";
import "../styles/position.css";

const President = ({
  candidates,
  selectedCandidate,
  handleCandidateSelection,
}) => {
  return (
    <div>
      <h2>President</h2>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="president"
                value={candidate.id} // Assuming 'id' is a unique identifier for the candidate
                checked={
                  selectedCandidate && selectedCandidate.id === candidate.id
                }
                onChange={() =>
                  handleCandidateSelection("President", candidate)
                }
              />
              <div className="candidate-info">
                <img src={candidate.image} alt={candidate.name} />
                <span>{candidate.name}</span>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default President;
