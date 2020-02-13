import {API_KEY, PROTOCOL, API_HOST} from '../constants';

export const getGenres = () => `${PROTOCOL}//${API_HOST}/genre/movie/list?api_key=${API_KEY}`;

export const getInTheaterPage = (page = 1) => `${PROTOCOL}//${API_HOST}/movie/now_playing?api_key=${API_KEY}&page=${page}`;

export const getSearchPage = (query, page = 1) => `${PROTOCOL}//${API_HOST}/search/movie?api_key=${API_KEY}&page=${page}&query=${query}`;

export const getMovieVideos = (id) => `${PROTOCOL}//${API_HOST}/movie/${id}/videos?api_key=${API_KEY}`;

export const getMovieReviews = (id, page = 1) => `${PROTOCOL}//${API_HOST}/movie/${id}/reviews?api_key=${API_KEY}&page=${page}`;

export const getSimilarMovies = (id, page = 1) => `${PROTOCOL}//${API_HOST}/movie/${id}/similar?api_key=${API_KEY}&page=${page}`;

export const Endpoint = {getGenres, getInTheaterPage, getSearchPage, getMovieVideos, getMovieReviews, getSimilarMovies};

/**
 * Fetches json data
 * @param   {*} input
 * @param   {Object=} init
 * @returns {*}
 * @throws  {TypeError}
 */
export const fetchJson = async (input, init = {}) => {
    init.mode = 'cors';
    init.headers = init.headers ? init.headers : new Headers();

    const request = new Request(input, init);

    const response = await fetch(request);
    return response.json();
};