// Treasurer.js
import React from "react";

const Treasurer = ({ candidates, selectedCandidate, handleCandidateSelection }) => {
  return (
    <div>
      <h2>Treasurer</h2> 
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="treasurer"
                value={candidate}
                checked={selectedCandidate === candidate}
                onChange={() => handleCandidateSelection("Treasurer", candidate)}
              />
              {candidate} 
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Treasurer;
