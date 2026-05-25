// ============================================
// MOVIE CONTEXT - GLOBAL MOVIE STATE MANAGEMENT
// Manages movies, favorites, and custom movies
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Create Movie Context
const MovieContext = createContext();

// Custom hook to use movie context
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within MovieProvider');
  }
  return context;
};

// Movie Provider Component
export const MovieProvider = ({ children }) => {
  // Store all movies (TMDB + custom)
  const [allMovies, setAllMovies] = useState([]);
  
  // Store custom movies in localStorage
  const [customMovies, setCustomMovies] = useLocalStorage('movie-explorer-custom-movies', []);

  // Initialize - merge TMDB movies with custom movies on mount
  useEffect(() => {
    // This will be updated by Home component with TMDB movies
  }, []);

  /**
   * Set TMDB movies from API
   * Called by Home component after fetching
   */
  const setApiMovies = (apiMovies) => {
    // Merge API movies with custom movies
    // Mark API movies as not custom
    const moviesWithFlag = apiMovies.map(m => ({
      ...m,
      isCustom: false,
      isFavorite: m.isFavorite || false // Preserve favorite status if exists
    }));
    setAllMovies(moviesWithFlag);
  };

  /**
   * Add a custom movie
   */
  const addMovie = (newMovie) => {
    const movieWithId = {
      ...newMovie,
      id: newMovie.id || Date.now(),
      isCustom: true,
      isFavorite: false,
    };

    // Add to custom movies (persisted)
    const updatedCustom = [...customMovies, movieWithId];
    setCustomMovies(updatedCustom);

    // Add to all movies
    setAllMovies(prev => [...prev, movieWithId]);

    return movieWithId;
  };

  /**
   * Delete a movie (only custom movies)
   */
  const deleteMovie = (movieId) => {
    // Remove from all movies
    setAllMovies(prev => prev.filter(m => m.id !== movieId));

    // Remove from custom movies
    const updatedCustom = customMovies.filter(m => m.id !== movieId);
    setCustomMovies(updatedCustom);
  };

  /**
   * Toggle favorite status
   */
  const toggleFavorite = (movieId) => {
    setAllMovies(prev =>
      prev.map(movie =>
        movie.id === movieId
          ? { ...movie, isFavorite: !movie.isFavorite }
          : movie
      )
    );

    // Also update custom movies if it's a custom movie
    const customMovie = customMovies.find(m => m.id === movieId);
    if (customMovie) {
      const updatedCustom = customMovies.map(m =>
        m.id === movieId ? { ...m, isFavorite: !m.isFavorite } : m
      );
      setCustomMovies(updatedCustom);
    }
  };

  /**
   * Get all movies
   */
  const getAllMovies = () => allMovies;

  /**
   * Get favorite movies
   */
  const getFavoriteMovies = () => allMovies.filter(m => m.isFavorite);

  /**
   * Get custom movies
   */
  const getCustomMovies = () => customMovies;

  // Context value
  const value = {
    allMovies,
    customMovies,
    setApiMovies,
    addMovie,
    deleteMovie,
    toggleFavorite,
    getAllMovies,
    getFavoriteMovies,
    getCustomMovies,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;
