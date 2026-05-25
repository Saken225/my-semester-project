import React, { useState, useEffect, useMemo } from 'react';
import { movieService } from '../services/movieService';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { useMovies } from '../context/MovieContext';

import SearchBar from '../components/filters/SearchBar';
import MovieFilter from '../components/filters/MovieFilter';
import SortButtons from '../components/filters/SortButtons';
import MovieList from '../components/layout/MovieList';
import Statistics from '../components/layout/Statistics';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

import './Home.css';

function Home() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [currentSort, setCurrentSort] = useState('');
  const [genres, setGenres] = useState([]);

  // Get movie context functions
  const { allMovies, setApiMovies, toggleFavorite, deleteMovie } = useMovies();

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch popular movies on mount
  const { 
    data: moviesData, 
    loading, 
    error, 
    refetch 
  } = useFetch(
    () => movieService.getPopular(1),
    [],
    true
  );

  // Update context with API movies when they change
  useEffect(() => {
    if (moviesData?.results) {
      setApiMovies(moviesData.results);
    }
  }, [moviesData, setApiMovies]);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresList = await movieService.getGenres();
        setGenres(['All', ...genresList.map(g => g.name)]);
      } catch (err) {
        console.error('Error fetching genres:', err);
      }
    };
    fetchGenres();
  }, []);

  // Search movies when debounced query changes
  useEffect(() => {
    if (debouncedSearch.trim()) {
      const searchMovies = async () => {
        try {
          const results = await movieService.search(debouncedSearch);
          // Handle search results
        } catch (err) {
          console.error('Search error:', err);
        }
      };
      searchMovies();
    }
  }, [debouncedSearch]);

  // Get movies array from context (now includes both API and custom movies)
  const movies = allMovies;

  // Filter and sort movies using useMemo
  const filteredAndSortedMovies = useMemo(() => {
    let filtered = [...movies];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        (movie.overview && movie.overview.toLowerCase().includes(query))
      );
    }

    // Filter by genre
    if (selectedGenre !== 'All') {
      filtered = filtered.filter(movie => {
        // Note: TMDB uses genre_ids, would need to map to names
        return true; // Simplified for now
      });
    }

    // Sort movies
    if (currentSort) {
      switch (currentSort) {
        case 'rating-desc':
          filtered.sort((a, b) => b.vote_average - a.vote_average);
          break;
        case 'rating-asc':
          filtered.sort((a, b) => a.vote_average - b.vote_average);
          break;
        case 'year-desc':
          filtered.sort((a, b) => {
            const yearA = new Date(a.release_date).getFullYear();
            const yearB = new Date(b.release_date).getFullYear();
            return yearB - yearA;
          });
          break;
        case 'year-asc':
          filtered.sort((a, b) => {
            const yearA = new Date(a.release_date).getFullYear();
            const yearB = new Date(b.release_date).getFullYear();
            return yearA - yearB;
          });
          break;
        case 'title-asc':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-desc':
          filtered.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    return filtered;
  }, [movies, searchQuery, selectedGenre, currentSort]);

  // Event handlers
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleSort = (sortOption) => {
    setCurrentSort(sortOption);
  };

  const handleToggleFavorite = (movieId) => {
    toggleFavorite(movieId);
  };

  const handleDeleteMovie = (movieId) => {
    deleteMovie(movieId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="home-page">
        <LoadingSpinner size="large" message="Loading movies from TMDB..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="home-page">
        <ErrorMessage 
          message={error}
          onRetry={refetch}
          fullPage
        />
      </div>
    );
  }

  // Empty state
  if (!movies || movies.length === 0) {
    return (
      <div className="home-page">
        <EmptyState
          icon="🎬"
          title="No movies found"
          message="We couldn't find any movies. Please try again later."
          actionText="Retry"
          actionLink="/"
        />
      </div>
    );
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>🎬 Discover Movies</h1>
        <p>Browse popular movies from The Movie Database (TMDB)</p>
      </div>

      {/* Statistics */}
      <Statistics movies={movies} />

      {/* Search */}
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Filter */}
      <MovieFilter 
        genres={genres}
        selectedGenre={selectedGenre}
        onGenreChange={handleGenreChange}
      />

      {/* Sort */}
      <SortButtons 
        onSort={handleSort}
        currentSort={currentSort}
      />

      {/* Results count */}
      <div className="results-info">
        <p>
          Showing {filteredAndSortedMovies.length} of {movies.length} movies
        </p>
      </div>

      {/* Movie List */}
      {filteredAndSortedMovies.length > 0 ? (
        <MovieList 
          movies={filteredAndSortedMovies}
          onToggleFavorite={handleToggleFavorite}
          onDeleteMovie={handleDeleteMovie}
        />
      ) : (
        <EmptyState
          icon="🔍"
          title="No matches found"
          message="Try adjusting your search or filters"
        />
      )}
    </div>
  );
}

export default Home;
