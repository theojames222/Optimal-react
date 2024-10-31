import React, { useEffect, useState } from "react";
import { fetchWorkouts } from "../services/firestoreServices";
import WorkoutDetailsModal from "../components/WorkoutDetailsModal"; // Import the modal component

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null); // Track the selected workout for the modal
  const [showModal, setShowModal] = useState(false);

  // Fetch workouts from Firebase
  useEffect(() => {
    const getWorkouts = async () => {
      try {
        const workoutsData = await fetchWorkouts(); // Fetch workouts using a Firestore function
        setWorkouts(workoutsData);
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    };
    getWorkouts();
  }, []);

  const openModal = (workout) => {
    setSelectedWorkout(workout); // Set the selected workout for display
    setShowModal(true); // Open the modal
  };

  const closeModal = () => {
    setSelectedWorkout(null);
    setShowModal(false);
  };

  return (
    <div>
      <h1>Saved Workouts</h1>
      <ul>
        {workouts.map((workout) => (
          <li
            key={workout.id}
            onClick={() => openModal(workout)}
            style={{
              cursor: "pointer",
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            {workout.name}
          </li>
        ))}
      </ul>
      {showModal && selectedWorkout && (
        <WorkoutDetailsModal workout={selectedWorkout} onClose={closeModal} />
      )}
    </div>
  );
}
