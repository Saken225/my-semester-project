import React from 'react';
import AddMovieForm from '../components/forms/AddMovieForm';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import './AddMoviePage.css';

function AddMoviePage() {
  const navigate = useNavigate();
  const { addMovie } = useMovies();

  const handleAddMovie = (newMovie) => {
    addMovie(newMovie);
    // Navigate to home after adding
    navigate('/');
  };

  const handleCancel = () => {
    // Navigate back to home
    navigate('/');
  };

  return (
    <div className="add-movie-page">
      <div className="page-header">
        <h1>➕ Add New Movie</h1>
        <p>Expand your collection with a new movie</p>
      </div>

      <AddMovieForm 
        onAddMovie={handleAddMovie}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default AddMoviePage;
