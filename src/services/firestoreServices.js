// src/services/firestoreService.js
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export async function fetchExercises() {
  try {
    const querySnapshot = await getDocs(collection(db, "exerciseMenu"));
    const exercises = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Add document ID
      ...doc.data(), // Spread the document data
    }));
    console.log("Fetched exercises:", exercises); // Add logging
    return exercises;
  } catch (error) {
    console.error("Error fetching exercises: ", error);
    throw error;
  }
}

export const saveWorkoutToFirestore = async (workout) => {
  try {
    const docRef = await addDoc(collection(db, "workouts1"), workout);
    console.log("Workout saved with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving workout:", error);
  }
};

export const fetchWorkouts = async () => {
  const querySnapshot = await getDocs(collection(db, "workouts1"));
  const workouts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return workouts;
};
