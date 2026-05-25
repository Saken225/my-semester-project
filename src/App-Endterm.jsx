import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MovieProvider } from './context/MovieContext';

// Components
import Navigation from './components/layout/Navigation-Updated';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import AddMoviePage from './pages/AddMoviePage';
import MovieDetails from './pages/MovieDetails-TMDB';
import About from './pages/About';
import AboutTeam from './pages/AboutTeam';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import './App-Endterm.css';

function App() {
  return (
    // Wrap entire app with providers
    <AuthProvider>
      <MovieProvider>
        <ThemeProvider>
          <BrowserRouter>
            <div className="App">
              {/* Navigation - always visible */}
              <Navigation />

              {/* Main Content - routes render here */}
              <main className="app-main">
                <div className="container">
                  <Routes>
                    {/* PUBLIC ROUTES */}
                    
                    {/* Route 1: Home Page */}
                    <Route path="/" element={<Home />} />

                    {/* Route 2: Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Route 3: Register */}
                    <Route path="/register" element={<Register />} />

                    {/* Route 4: Movie Details (Dynamic Route) */}
                    <Route path="/movie/:id" element={<MovieDetails />} />

                    {/* Route 5: About with NESTED ROUTE */}
                    <Route path="/about" element={<About />}>
                      {/* Nested Route: Team */}
                      <Route path="team" element={<AboutTeam />} />
                    </Route>

                    {/* PROTECTED ROUTES - Require Authentication */}
                    
                    {/* Route 6: Favorites (Protected) */}
                    <Route 
                      path="/favorites" 
                      element={
                        <ProtectedRoute>
                          <Favorites />
                        </ProtectedRoute>
                      } 
                    />

                    {/* Route 7: Add Movie (Protected) */}
                    <Route 
                      path="/add-movie" 
                      element={
                        <ProtectedRoute>
                          <AddMoviePage />
                        </ProtectedRoute>
                      } 
                    />

                    {/* 404 Route - Must be last */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>

              {/* Footer */}
              <footer className="app-footer">
                <div className="container">
                  <p>© 2026 Movie Explorer | Endterm Project</p>
                  <p className="tech-stack">
                    React • React Router • Context API • TMDB API • localStorage
                  </p>
                  <p className="features">
                    ✅ Authentication • ✅ Protected Routes • ✅ API Integration • ✅ Custom Hooks
                  </p>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
