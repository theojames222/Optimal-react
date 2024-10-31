import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";
import Builder from "./pages/Builder";
import Workouts from "./pages/Workouts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/optimal_u_app/exercises" element={<Exercises />} />
        <Route path="/optimal_u_app/builder" element={<Builder />} />
        <Route path="/optimal_u_app/workouts" element={<Workouts />} />
      </Routes>
    </Router>
  );
}

export default App;
