import _ from 'lodash';

import {STORE_ACTIONS} from './actions';
import {DEFAULT_ROUTE, ROUTE_HASHES, ROUTE_STATE_TEMPLATE} from '../constants';

export const defaultState = _.assign({}, getDefaultGenericState(), getDefaultRouteState());

export default (state = _.assign({}, defaultState), action) => {
    switch(action.type) {
      case STORE_ACTIONS.ROUTE:
        const {route} = action;
        return _.assign({}, state, {route});

      case STORE_ACTIONS.SEARCH_QUERY:
        const {search_query} = action;
        const patch = getDefaultRouteState(ROUTE_HASHES.SEARCH);
        return _.assign({}, state, patch, {search_query});

      case STORE_ACTIONS.GENRES:
        const {genres} = action;
        return _.assign({}, state, {genres});

      case STORE_ACTIONS.ERROR:
        const {error} = action;
        const errors = [error, ...state.errors];
        return _.assign({}, state, {errors});

      case STORE_ACTIONS.SEARCH_PAGES:
      case STORE_ACTIONS.IN_THEATERS_PAGES:
        return patchPagesAndList(state, action);

      case STORE_ACTIONS.SEARCH_MOVIE_EXPANDED:
      case STORE_ACTIONS.IN_THEATERS_MOVIE_EXPANDED:
        return patchExpandedList(state, action);

      case STORE_ACTIONS.SEARCH_VIDEOS:
      case STORE_ACTIONS.SEARCH_REVIEWS:
      case STORE_ACTIONS.IN_THEATERS_VIDEOS:
      case STORE_ACTIONS.IN_THEATERS_REVIEWS:
      case STORE_ACTIONS.IN_THEATERS_SIMILAR:
      case STORE_ACTIONS.SEARCH_SIMILAR:
        return patchSinglePageList(state, action);

      default:
        return _.assign({}, state);
    }
};

/**
 * Returns a map of all state props needed per route
 * @param   {string|Array<string>} hashes
 * @returns {Object}
 * @private
 */
function getDefaultRouteState(hashes = _.values(ROUTE_HASHES)) {
    return _.chain(hashes)
        .castArray()
        .map((routeHash) => _.mapKeys(ROUTE_STATE_TEMPLATE, (value, key) => `${routeHash}_${key}`))
        .reduce((result, value) => _.merge(result, value))
        .valueOf();
};

function getDefaultGenericState() {
    return {    
        /**
        * The route of the app
        * @type {string}
        */
        route: DEFAULT_ROUTE,

        /**
        * List of genres
        * @type {Array}
        */
        genres: [],

        /**
        * List of errors
        * @type {Array}
        */
        errors: []
    };
};

function getPagesAndListPatch(state, action, pagesProp, listProp) {
    const {page} = action;

    // List of current pages from state without the action's page
    const pages = _.chain(state)
        .get(`${pagesProp}`, [])
        .reject({page: page.page})
        .concat(page)
        .valueOf();

    // const pages = [...oldPages, page];
    // Sort by page number
    pages.sort((a, b) => a.page - b.page);

    // Compile the list of movies
    const list = pages.reduce((movies, {results}) => [...movies, ...results], []);

    return _.chain({})
        .set(`${pagesProp}`, pages)
        .set(`${listProp}`, list)
        .valueOf();
}

function patchPagesAndList(state, action) {
    const {type} = action;

    const {pagesProp, listProp} = {
        [STORE_ACTIONS.IN_THEATERS_PAGES]: {
            listProp: 'in_theaters_list',
            pagesProp: 'in_theaters_pages'
        },
        [STORE_ACTIONS.SEARCH_PAGES]: {
            listProp: 'search_list',
            pagesProp: 'search_pages'
        }
    }[type];

    const patch = getPagesAndListPatch(state, action, pagesProp, listProp);

    return _.assign({}, state, patch);
};

function patchExpandedList(state, action) {
    const {id, type, expanded} = action;

    const listProp = {
        [STORE_ACTIONS.SEARCH_MOVIE_EXPANDED]: 'search_expanded',
        [STORE_ACTIONS.IN_THEATERS_MOVIE_EXPANDED]: 'in_theaters_expanded'
    }[type];

    const list = _.chain(state)
        .get(`${listProp}`)
        .reject({id})
        .valueOf();

    const patch = _.set({}, `${listProp}`, [...list, {id, expanded}]);

    return _.assign({}, state, patch);
};

function patchSinglePageList(state, action) {
    const {id, type, page} = action;
    const pages = [page];

    const listProp = {
        [STORE_ACTIONS.SEARCH_VIDEOS]: 'search_videos',
        [STORE_ACTIONS.SEARCH_REVIEWS]: 'search_reviews',
        [STORE_ACTIONS.SEARCH_SIMILAR]: 'search_similar',
        [STORE_ACTIONS.IN_THEATERS_VIDEOS]: 'in_theaters_videos',
        [STORE_ACTIONS.IN_THEATERS_REVIEWS]: 'in_theaters_reviews',
        [STORE_ACTIONS.IN_THEATERS_SIMILAR]: 'in_theaters_similar',
    }[type];

    const list = _.chain(state)
        .get(`${listProp}`)
        .reject({id})
        .valueOf();

    const patch = _.set({}, `${listProp}`, [...list, {id, pages}]);

    return _.assign({}, state, patch);
};
