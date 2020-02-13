import './styles.scss';

import _ from 'lodash';

import {STORE_ACTIONS, initStore, fetchGenres, fetchSearchPage, fetchInTheatersPage, setRoute} from './store'; 
import {ROUTE_HASHES} from './constants';
import {Routing} from './routing';
import {Navigation, InTheaters, Search} from './components';

const store = initStore();

document.addEventListener('DOMContentLoaded', init);

window.addEventListener('hashchange', loadLocation);

window.onscroll = _.throttle(function() {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        Routing.onScroll();
    }
}, 300);

async function loadLocation() {
    const locationHash = window.location.hash.replace('#', '');
    try {
        const hash = await Routing.loadRoute(locationHash);
        window.history.replaceState(null, null, `#${hash}`);
        setRoute(hash);
    } catch (error) {
        store.dispatch({type: STORE_ACTIONS.ERROR, error});
    }
};

async function init() {
    Routing
        .setHost(document.getElementById('app'))
        .setRoute(ROUTE_HASHES.IN_THEATERS, InTheaters, [fetchGenres, fetchInTheatersPage], fetchInTheatersPage)
        .setRoute(ROUTE_HASHES.SEARCH, Search, [fetchGenres, fetchSearchPage], fetchSearchPage)
        .setDefault(ROUTE_HASHES.IN_THEATERS);

    const navigation = new Navigation(document.getElementById('nav'));
    navigation.mount();

    return loadLocation();
};
