import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/optimal_u_app/exercises" element={<Exercises />} />
      </Routes>
    </Router>
  );
}

export default App;
