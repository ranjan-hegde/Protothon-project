import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [renderSplash, setRenderSplash] = useState(true);

  useEffect(() => {
    // Start curtain animation after 2.5 seconds (gives a good 2s of reading time)
    const animationTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    // Completely unmount splash screen after the 1s transition finishes
    const unmountTimer = setTimeout(() => {
      setRenderSplash(false);
    }, 3500);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <>
      {renderSplash && (
        <div
          className={`fixed inset-0 z-[100] bg-green-900/40 backdrop-blur-md flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${showSplash ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          <div className="text-center px-12 py-16 liquid-glass rounded-3xl mx-4 shadow-2xl">
            <h1 className="text-xl md:text-3xl font-medium text-green-800 tracking-[0.2em] mb-4 uppercase drop-shadow-sm font-['SF_Pro_Text','-apple-system']">
              Presented By
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-green-900 tracking-widest uppercase drop-shadow-md font-['SF_Pro_Text','-apple-system']">
              RANJAN <br /> INDRAJ <br /> SUJAY
            </h2>
          </div>
        </div>
      )}

      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect to dashboard as default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
