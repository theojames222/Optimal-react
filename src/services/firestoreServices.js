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
