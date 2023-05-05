import './App.css';
import { useCallback, useEffect, useRef, useState, useId } from 'react';
import Movies  from './components/Movies';
import useMovies from './hooks/useMovies';
import debounce from 'just-debounce-it';

function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null);
  const isFirstInput = useRef(true);

  useEffect(()=>{
    if(isFirstInput.current){
      isFirstInput.current = search === '';
      return;
    }
    if(search === ''){
      setError('No se puede buscar una pelicula vacia');
      return;
    }

    if(search.startsWith(Number)){
      setError('No ingresar numeros al comienzo');
      return;
    }

    setError(null);    
  }, [search])

  return { search, updateSearch, error}
}

function App() {
  // Api Key: 27dfd2e7
  // http://www.omdbapi.com/?apikey=27dfd2e7&s=`${search}`;
  const [sort, setSort] = useState(false);
  const {search, updateSearch, error} = useSearch();
  const { movies, loading, getMovies} = useMovies({ search, sort });
  const checkboxAZ = useId();

  const debouncedGetMovies = useCallback(debounce(search => {
      console.log('search', search);
      getMovies(search);
    }, 400)
  ,[]);

  const handleSubmit = (e) => {
    e.preventDefault();
    getMovies(search);
  }

  const handleChange = (e) => {
    const newSearch = e.target.value;
    if(newSearch.startsWith(' ')) return;
    updateSearch(newSearch);
    debouncedGetMovies(newSearch);
  }

  const handleSort = () => {
    setSort(!sort);
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='search' placeholder='Avengers, Star Wars, The Matrix' type="text" />
          <div className='checkbox-az-form'>
            <label htmlFor={checkboxAZ}>A-Z</label>
            <input id={checkboxAZ} type="checkbox" onChange={handleSort} checked={sort} />
          </div>
          <button type='submit'>Buscar</button>
        </form>

        {error && <p style={{color: 'red'}}>{error}</p>}
      </header>
      
      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={ movies }></Movies> 
        }
      </main>

    </div>
  )
}

export default App
