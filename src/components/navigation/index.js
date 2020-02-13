import './styles.scss';

import _ from 'lodash';
import {render, html} from 'lighterhtml';

import {store, STORE_ACTIONS, setSearchQuery, fetchSearchPage} from '../../store';
import {ROUTE_HASHES} from '../../constants';
import {StoreComponent} from '../store-component';

export class Navigation extends StoreComponent {
    get actions() {
        return [
            STORE_ACTIONS.ROUTE
        ];
    }

    get namespace() {
        return 'navigation';
    }

    get route() {
        const {route} = store.getState();
        return route;
    }

    get query() {
        const {search_query, in_theaters_query} = store.getState();
        return this.isSearchRoute ? search_query : in_theaters_query;
    }

    get isSearchRoute() {
        return this.route === ROUTE_HASHES.SEARCH;
    }

    get searchBox() {
        return html`
            <div class='${this.namespace}-item search-box ${this.isSearchRoute ? 'active': ''}'>
                <input
                    type='text'
                    tabindex='${this.isSearchRoute ? 4 : 1}'
                    value='${this.query}'
                    oninput='${this.onQueryChange}'
                    onfocus='${this.onKeyPress}'
                    placeholder='Type anything...' />
            </div>`;
    }

    get routeLinks() {
        return _.chain(ROUTE_HASHES)
            .values()
            .map((route, index) => this.renderRouteLink(route, 2 + index))
            .valueOf();
    }

    constructor() {
        super(...arguments);

        /**
         * Throttled version of onQueryChange_
         * @type {Function}
         */
        this.onQueryChange = _.debounce(this.onQueryChange_.bind(this), 300);

        /**
         * Throttled callback for onkeypress
         * @type {Function}
         */
        this.onKeyPress = _.throttle(this.setSearchRoute.bind(this), 300);
    }

    renderRouteLink(route, index) {
        return html`
            <div class='${this.namespace}-item ${route}'>
                <a
                    tabindex='${index}'
                    class='${this.route === route ? 'active' : ''}'
                    href="#${route}">${_.upperCase(route)}</a>
            </div>`;
    }

    mount() {
        render(this.host, html`
            <div class='${this.namespace}'>
                ${this.routeLinks}
                ${this.searchBox}
            </div>`);
    }

    setSearchRoute() {
        if (!this.isSearchRoute) {
            window.location.hash = ROUTE_HASHES.SEARCH;
        }
    }

    async onQueryChange_(event) {
        this.setSearchRoute();

        const query = _.chain(event).get('target.value', '').trim().valueOf();

        if (query !== this.query) {
            setSearchQuery(query);
            await fetchSearchPage();
        }
    }
}

export default Navigation;