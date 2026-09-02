import React, { useState, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Home from './pages/Home';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import NoteDetails from './pages/NoteDetails';

const App = () => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback(({ type = 'success', message }) => {
    setToast({ type, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <div className="app-layout">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/create" element={<CreateNote showToast={showToast} />} />
          <Route path="/edit/:id" element={<EditNote showToast={showToast} />} />
          <Route path="/notes/:id" element={<NoteDetails showToast={showToast} />} />
          {/* Catch-all 404 Route */}
          <Route
            path="*"
            element={
              <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-primary)' }}>404</h1>
                <h2 style={{ marginBottom: '1rem' }}>Page Not Found</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                  The page you are looking for does not exist or has been moved.
                </p>
                <Link to="/" className="btn-primary">
                  Return to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Global Toast Alerts */}
      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
};

export default App;
