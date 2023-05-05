import { useRef, useState, useMemo, useCallback } from 'react';
import { searchMovies } from '../services/movies';

function useMovies({ search, sort }) {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const previousSearch = useRef(search);

	{/*El use callback es lo mismo que el useMemo pero
	pensado para funciones, ya que con useMemo nos quedaria
	una sintaxis más larga, creando una función flecha
	que devuelva una función, y eso es medio raro...*/}
	const getMovies = useCallback(async (search) => {
		if(search === previousSearch.current) return
		try{
			setLoading(true);
			setError(null)
			previousSearch.current = search;
			const newMovies = await searchMovies(search);
			setMovies(newMovies);
		} 
		catch (e) {
			setError(e)
		}
		finally{
			setLoading(false);
		}
	},[])

	{/*Lo que hace el use memo es evitar tener que volver a 
		ordenar la lista si no ha cambiado las dependencias.*/}
	const sortedMovies = useMemo(() => { 
		if(movies){
			return sort 
			? [...movies].sort((a,b )=> a.title.localeCompare(b.title))
			: movies
		}
		}, [sort, movies])

	return {movies: sortedMovies, loading, getMovies}
}
  
export default useMovies;