// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import HomePage from "../../pages/home/Home";
import HemisphereSelection from '../hemisphereSelection/HemisphereSelection';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/select" element={<HemisphereSelection />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
