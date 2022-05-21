import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Demo from "./pages/Demo";
import ContactUs from "./pages/Contact/Contact-us";
import Project from "./pages/Project/Project";
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./Components/NavBar/NavBar";

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" exact element={<Project />} />
                 <Route path="/project" element={<Project />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/contact" element={<ContactUs />} />
            </Routes>
        </Router>
    );
}

export default App;
