import React from "react";

export default function WorkoutDetailsModal({ workout, onClose }) {
  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <button onClick={onClose} style={closeButtonStyle}>
          Close
        </button>
        <h2>{workout.name}</h2>
        <p>
          <strong>Description:</strong> {workout.description}
        </p>
        <p>
          <strong>Instructions:</strong> {workout.instructions}
        </p>
        <h3>Exercise Blocks</h3>
        {workout.blocks.map((block, index) => (
          <div key={index} style={{ marginBottom: "15px" }}>
            <h4>{block.name || `Block ${index + 1}`}</h4>
            <p>{block.description}</p>
            <p>{block.instructions}</p>
            <ul>
              {block.exercises.map((exercise, i) => (
                <li key={i}>
                  <p>
                    <strong>
                      {exercise.order}. {exercise.name}
                    </strong>
                  </p>
                  <p>Weight: {exercise.weight}</p>
                  <p>Reps: {exercise.reps}</p>
                  <p>Modality: {exercise.modality}</p>
                  <p>RIR: {exercise.rir}</p>
                  <p>Rest: {exercise.rest}</p>
                  <p>Notes: {exercise.notes}</p>
                  {exercise.additionalSets &&
                    exercise.additionalSets.length > 0 && (
                      <div style={{ paddingLeft: "15px" }}>
                        <h5>Additional Sets</h5>
                        {exercise.additionalSets.map((set, j) => (
                          <div key={j} style={{ marginBottom: "10px" }}>
                            <p>Set {j + 2}</p>
                            <p>Weight: {set.weight}</p>
                            <p>Reps: {set.reps}</p>
                            <p>Modality: {set.modality}</p>
                            <p>RIR: {set.rir}</p>
                            <p>Rest: {set.rest}</p>
                            <p>Notes: {set.notes}</p>
                          </div>
                        ))}
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// Basic modal styles for simplicity
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "80vh",
  overflowY: "auto",
};

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  cursor: "pointer",
};
