import React from 'react';
import MovieList from '../components/layout/MovieList';
import { Link } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import './Favorites.css';

function Favorites() {
  // Get movies from context
  const { allMovies, toggleFavorite, deleteMovie } = useMovies();

  // Filter only favorite movies
  const favoriteMovies = allMovies.filter(movie => movie.isFavorite);

  const handleToggleFavorite = (movieId) => {
    toggleFavorite(movieId);
  };

  const handleDeleteMovie = (movieId) => {
    deleteMovie(movieId);
  };

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1>❤️ My Favorites</h1>
        <p>Your personally curated collection of favorite movies</p>
      </div>

      {favoriteMovies.length === 0 ? (
        <div className="no-favorites">
          <div className="no-favorites-icon">💔</div>
          <h2>No favorites yet</h2>
          <p>Start adding movies to your favorites by clicking the heart icon!</p>
          <Link to="/" className="back-home-btn">
            Browse Movies
          </Link>
        </div>
      ) : (
        <>
          <div className="favorites-count">
            <span className="count-badge">{favoriteMovies.length}</span>
            {favoriteMovies.length === 1 ? 'Favorite Movie' : 'Favorite Movies'}
          </div>

          <MovieList 
            movies={favoriteMovies}
            onToggleFavorite={handleToggleFavorite}
            onDeleteMovie={handleDeleteMovie}
          />
        </>
      )}
    </div>
  );
}

export default Favorites;
