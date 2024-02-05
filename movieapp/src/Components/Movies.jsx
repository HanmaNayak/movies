// Movies.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // okay
  useEffect(() => {
    // Fetch movies from the API
    axios.get('https://movies-api14.p.rapidapi.com/movies', {
      headers: {
        'X-RapidAPI-Key': '33e0d5f2f4msh43526b5c69da22ap1974e6jsndf6102263dd1',
        'X-RapidAPI-Host': 'movies-api14.p.rapidapi.com'
      },
    })
    .then(response => {
      setMovies(response.data.movies);
      setFilteredMovies(response.data.movies);
      console.log("Movies: "+ JSON.stringify(response.data.movies))
    })
    .catch(error => {
      console.error('Error fetching movies:', error);
    });
  }, []);

  const handleSearch = () => {
    // Filter movies based on released_date
    const filtered = movies.filter(movie =>
      movie.release_date.includes(searchQuery)
    );
    setFilteredMovies(filtered);
  };

  const handleModalOpen = (movieId) => {
    // Set the selected movie when the "View Trailer" button is clicked

    // Fetch individual movie details using the provided API (optional)
    axios.get(`https://movies-api14.p.rapidapi.com/movie/${movieId}`, {
      headers: {
        'X-RapidAPI-Key': '33e0d5f2f4msh43526b5c69da22ap1974e6jsndf6102263dd1',
        'X-RapidAPI-Host': 'movies-api14.p.rapidapi.com'
      },
    })
    .then(response => {
      // Display the movie details in the modal (you can implement this part)
      setSelectedMovie(response.data.movie);

      console.log(response.data);
    })
    .catch(error => {
      console.error('Error fetching movie details:', error);
    });
  };

  const handleModalClose = () => {
    // Close the modal and reset the selected movie
    setSelectedMovie(null);
  };

  return (
    <div>
      <h1>Movie App</h1>
      <input
        type="text"
        placeholder="Search by released date"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="movie-grid">
        {filteredMovies.map(movie => (
          <div key={movie._id} className="movie-card">
            <img src={movie.poster_path} alt={movie.title} style={{ maxWidth: '200px' }} />
            <h2>{movie.title}</h2>
            <p>Released Date: {movie.release_date}</p>
            <p>Genres: {movie.genres.join(', ')}</p>
            <button onClick={() => handleModalOpen(movie._id)}>View Trailer</button>
          </div>
        ))}
      </div>

      {/* Modal for displaying individual movie details */}
      <Modal
        isOpen={selectedMovie !== null}
        onRequestClose={handleModalClose}
        contentLabel="Movie Details Modal"
      >
        {selectedMovie && (
          <div className='modal' >
            <h2>{selectedMovie.title}</h2>
           
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${selectedMovie.youtube_trailer.split('v=')[1]}`}
              title="YouTube Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <button style={{width:'100px',marginTop:'24px',padding:'10px'}} onClick={handleModalClose}>Close Modal</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Movies;
