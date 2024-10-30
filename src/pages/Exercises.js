// src/pages/Exercises.js
import React, { useEffect, useState } from "react";
import { fetchExercises } from "../services/firestoreServices"; // Corrected import path

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getExercises = async () => {
      try {
        const exercisesData = await fetchExercises();
        setExercises(exercisesData);
      } catch (error) {
        console.error("Failed to fetch exercises:", error);
      } finally {
        setLoading(false);
      }
    };

    getExercises();
  }, []);

  if (loading) {
    return <p>Loading exercises...</p>;
  }

  if (exercises.length === 0) {
    return <p>No exercises found.</p>;
  }

  return (
    <ul>
      {exercises.map((exercise) => (
        <li key={exercise.id}>{exercise.name}</li>
      ))}
    </ul>
  );
}

export default Exercises;
