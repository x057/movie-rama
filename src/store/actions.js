import _ from 'lodash';

import {store} from './store';
import {Endpoint, fetchJson} from '../libs/network';

/**
 * Map of actions that are route independent
 * @type {Object}
 */
export const STORE_ACTIONS_GENERIC = {
    ROUTE: 'ROUTE',
    ERROR: 'ERROR',
    GENRES: 'GENRES'    
};

/**
 * Map of actions specific to in_theaters route
 * @type {Object}
 */
export const STORE_ACTIONS_IN_THEATERS = {
    IN_THEATERS_PAGES: 'IN_THEATERS_PAGES',
    IN_THEATERS_VIDEOS: 'IN_THEATERS_VIDEOS',
    IN_THEATERS_REVIEWS: 'IN_THEATERS_REVIEWS',
    IN_THEATERS_SIMILAR: 'IN_THEATERS_SIMILAR',
    IN_THEATERS_MOVIE_EXPANDED: 'IN_THEATERS_MOVIE_EXPANDED'
};

/**
 * Map of actions specific to search route
 * @type {Object}
 */
export const STORE_ACTIONS_SEARCH = {
    SEARCH_QUERY: 'SEARCH_QUERY',
    SEARCH_PAGES: 'SEARCH_PAGES',
    SEARCH_VIDEOS: 'SEARCH_VIDEOS',
    SEARCH_REVIEWS: 'SEARCH_REVIEWS',
    SEARCH_SIMILAR: 'SEARCH_SIMILAR',
    SEARCH_MOVIE_EXPANDED: 'SEARCH_MOVIE_EXPANDED'
};

/**
 * Map of all actions
 * @type {Object}
 */
export const STORE_ACTIONS = _.assign({}, STORE_ACTIONS_GENERIC, STORE_ACTIONS_IN_THEATERS, STORE_ACTIONS_SEARCH);

export const setRoute = (route) => {
    store.dispatch({type: STORE_ACTIONS.ROUTE, route});
};

export const setSearchQuery = (search_query) => {
    store.dispatch({type: STORE_ACTIONS.SEARCH_QUERY, search_query});
};

export const fetchGenres = async () => {
    try {
        const {genres} = await fetchJson(Endpoint.getGenres());
        store.dispatch({type: STORE_ACTIONS.GENRES, genres});
        return genres;
    } catch (error) {
        store.dispatch({type: STORE_ACTIONS.ERROR, error});
        throw error;
    }
};

export const fetchInTheatersPage = async () => {
    const {in_theaters_pages} = store.getState();
    const next = getNextPage(in_theaters_pages);
    const endpoint = Endpoint.getInTheaterPage(next)
    return fetchNextPage(in_theaters_pages, endpoint, STORE_ACTIONS.IN_THEATERS_PAGES, next);
};

export const fetchSearchPage = async () => {
    const {search_query, search_pages} = store.getState();
    const next = getNextPage(search_pages);
    const endpoint = Endpoint.getSearchPage(`${search_query}`.trim() || '*', next);
    return fetchNextPage(search_pages, endpoint, STORE_ACTIONS.SEARCH_PAGES, next);
};

export const toggleInTheaterExpandedContent = async (id) => {
    const {in_theaters_expanded, in_theaters_videos, in_theaters_reviews, in_theaters_similar} = store.getState();

    const fetchList = [{
        list: in_theaters_videos,
        endpoint: Endpoint.getMovieVideos(id),
        type: STORE_ACTIONS.IN_THEATERS_VIDEOS
    }, {
        list: in_theaters_reviews,
        endpoint: Endpoint.getMovieReviews(id),
        type: STORE_ACTIONS.IN_THEATERS_REVIEWS
    }, {
        list: in_theaters_similar,
        endpoint: Endpoint.getSimilarMovies(id),
        type: STORE_ACTIONS.IN_THEATERS_SIMILAR
    }];

    return toggleExpandedContent(id, in_theaters_expanded, STORE_ACTIONS.IN_THEATERS_MOVIE_EXPANDED, fetchList);
};

export const toggleSearchExpandedContent = async (id) => {
    const {search_expanded, search_videos, search_reviews, search_similar} = store.getState();

    const fetchList = [{
        list: search_videos,
        endpoint: Endpoint.getMovieVideos(id),
        type: STORE_ACTIONS.SEARCH_VIDEOS
    }, {
        list: search_reviews,
        endpoint: Endpoint.getMovieReviews(id),
        type: STORE_ACTIONS.SEARCH_REVIEWS
    }, {
        list: search_similar,
        endpoint: Endpoint.getSimilarMovies(id),
        type: STORE_ACTIONS.SEARCH_SIMILAR
    }];

    return toggleExpandedContent(id, search_expanded, STORE_ACTIONS.SEARCH_MOVIE_EXPANDED, fetchList);
};

async function toggleExpandedContent(id, expandedList, type, fetchList) {
    const expanded = !_.chain(expandedList)
        .find({id})
        .get('expanded', false)
        .valueOf();

    store.dispatch({type, id, expanded});

    if (expanded) {
        await fetchExtendContent(id, fetchList);
    }

    return {id, expanded};
};

/**
 * Fetches multiple resources returning one single result
 * @param   {number} id
 * @param   {Array<Object>} fetchList
 * @returns {Promise}
 * @private
 */
async function fetchExtendContent(id, fetchList) {
    try {
        return await Promise.all(_.map(fetchList, ({list, endpoint, type}) => fetchSinglePage(list, endpoint, type, id)));
    } catch (error) {
        store.dispatch({type: STORE_ACTIONS.ERROR, error});
        throw error;
    }
};

/**
 * Fetches the next page from the api or the last fetched page if all pages have been fetched
 * @param   {Array<Object>} list
 * @param   {string} endpoint
 * @param   {string} type
 * @param   {number} next
 * @returns {Promise}
 * @private
 */
async function fetchNextPage(list, endpoint, type, next) {
    try {
        const totalPages = getTotalPages(list);

        if (list.length && totalPages < next) {
            return Promise.resolve(_.last(list));
        }

        const page = await fetchJson(endpoint);
        store.dispatch({type, page});
    } catch (error) {
        store.dispatch({type: STORE_ACTIONS.ERROR, error});
        throw error;
    }
};

async function fetchSinglePage(list, endpoint, type, id) {
    try {
        let page = _.find(list, {id});

        if (page) {
            return page;
        }

        page = await fetchJson(endpoint);
        store.dispatch({type, id, page});
        return page;
    } catch (error) {
        store.dispatch({type: STORE_ACTIONS.ERROR, error});
        throw error;
    }
};

/**
 * Returns the next page given a list of page results
 * @param   {Array<Object>} list
 * @returns {number}
 * @private
 */
function getNextPage(list = []) {
    return _.isEmpty(list) ? 1 : _.chain(list).map('page').max().valueOf() + 1;
};

/**
 * Returns the biggest total_pages number from a list of page results
 * @param   {Array<Object>} list
 * @returns {number}
 * @private
 */
function getTotalPages(list = []) {
    return _.isEmpty(list) ? 0 : _.chain(list).map('total_pages').max().valueOf();
};
