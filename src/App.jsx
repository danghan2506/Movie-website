
import { use, useEffect, useState } from 'react'
import Search from './components/search'
import LoadingSpinner from './components/LoadingSpinner'
import MovieCard from './components/MovieCard'
import { useDebounce, useSearchParam } from 'react-use'
import  { getTrendingMovies, updateSearchCount } from './appwrite'
const API_BASE_URL = 'https://api.themoviedb.org/3/'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
// fetch request
const API_OPTIONS = {
  method: 'GET', // lấy dữ liệu từ server
  headers: {
    accept: 'application/json', // server trả về dữ liệu dưới dạng JSON.
    Authorization: `Bearer ${API_KEY}` // Gửi một mã thông báo (API_KEY) để xác thực với API.
  }
}
const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [movieList, setMovieList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [useDebounceSearchTerm, setUseDebounceSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([])

useDebounce(() => {
  setUseDebounceSearchTerm(searchTerm);
}, 500, [searchTerm]); // 1000ms delay and dependency array
  const fetchMovies = async(query='') => {
    setIsLoading(true)

    try{
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      : `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`
      const response =  await fetch(endpoint, API_OPTIONS)
      if(!response.ok){
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch data!')
        setMovieList([])
        return
      }
      console.log(data)
      setMovieList(data.results)
      if(query && data.results.length > 0){
        await updateSearchCount(query, data.results[0])
      }
    }
    catch(err){
      console.error(`Error while fetching movies: ${err}`)
    }
    finally{
      setIsLoading(false)
    }
  }
  const loadTrendingMovies = async () => {
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    }
    catch(err){
      console.error(`Error while fetching movies!: ${err}`)
    }
  }
  useEffect(() => {
    fetchMovies(useDebounceSearchTerm)
  }, [useDebounceSearchTerm])
  useEffect(() => {
    loadTrendingMovies()
  }, )
  return(
    <main>
      <div className='pattern'/>
        <div className='wrapper'>
          <header>
          
          <img src="./hero.jpg" alt='Hero-background'/>
          <h1>Find <span className='text-gradient'>Movies</span> that you like <br/> the best!</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          {trendingMovies.length > 0 && (
            <section className='trending'>
              <h2>Trending movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title}></img>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        
        <section className='all-movies'>
            <h2>All Movies</h2>
            {isLoading ? (
                <LoadingSpinner/>
              ) : errorMessage ? (
                <p>{errorMessage}</p>
              ) : (
                <ul>
                  {movieList.map((movie) => (
                   <MovieCard key={movie.id} movie={movie}/>
                  ))}
                </ul>
              )
            }
          </section>
    </main>
  )
}


export default App
