import React from 'react'

function MovieCard( {movie: { overview, popularity, poster_path, release_date, title, vote_average, vote_count, original_language}}) {
  return (
    <div className='movie-card'>
       <img src={poster_path ? `https:image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'}></img>
       <div className='mt-4'>
        <h3>{title}</h3>
        <div className='content'>
        <div className='rating'>
            <img src="./heart.svg" alt='Star'></img>
            <p>{vote_average ? vote_average.toFixed(1): 'N/A'}</p>
            <span>•</span>
            <div className='lang'>{original_language}</div>
            <span>•</span>
            <p className='year'>{release_date ? release_date.split('-')[0] : 'N/A'}</p>
        </div>
        </div>
       
    </div>
    </div>   
  )
}

export default MovieCard
