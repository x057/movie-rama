import _ from 'lodash';

export const Routing = {setHost, setRoute, setDefault, loadRoute, onScroll};

const routing_ = {
    /**
     * Element on which the route component will be mounted
     * @type {Element}
     */
    host: null,

    /**
     * Map of routes
     * @type {Object}
     */
    routes: null,

    /**
     * The currently active route
     * @type {Object}
     */
    activeRoute: null,

    /**
     * The hash of the default route
     * @type {string}
     */
    default: null
};

function setHost(host) {
    _.set(routing_, 'host', host);
    return Routing;
};

function setRoute(hash, Component, onLoad, onScroll) {
    _.set(routing_, `routes.${hash}`, {Component, onLoad, onScroll});
    return Routing;
};

function setDefault(hash) {
    _.set(routing_, 'default', `${hash}`);
    return Routing;
};

function onScroll() {
    const activeRoute = getActiveRoute();

    if (activeRoute) {
        const {onScroll} = activeRoute;
        return onScroll();
    }
};

function loadRoute(hash_) {
    return new Promise((resolve, reject) => {
        // Stays on the active route if the new hash is invalid
        if (!isHash(hash_) && getActiveRoute()) {
            resolve(getActiveHash());
            return;
        }

        destroyActiveRoute();

        const hash = isHash(hash_) ? hash_ : getDefault();

        if (_.isNil(hash)) {
            reject(new Error('No fallback...'));
            return;
        }

        const {Component, onLoad, onScroll} = getRoute(hash);

        Promise
            .all(_.chain(onLoad).castArray().map((p) => p()).valueOf())
            .then(() => {
                const component = new Component(getHost());
                component.mount();
                setActiveRoute({hash, component, onScroll});
                resolve(hash);
            })
            .catch(reject);
    });
};

function getActiveRoute() {
    return _.get(routing_, 'activeRoute');
};

function getActiveHash() {
    return _.get(getActiveRoute(), 'hash');
};

function setActiveRoute(activeRoute) {
    _.set(routing_, 'activeRoute', activeRoute);
};

function destroyActiveRoute() {
    const activeRoute = getActiveRoute();

    if (activeRoute) {
        const {component} = activeRoute;
        component.unmount();
    }

    setActiveRoute(null);   
};

function getRoute(hash) {
    return _.get(routing_, `routes.${hash}`) || null;
};

function getDefault() {
    return _.get(routing_, 'default');
};

function getHashes() {
    return _.chain(routing_)
        .get('routes')
        .keys()
        .valueOf();
};

function isHash(hash) {
    return _.includes(getHashes(), `${hash}`);
};

function getHost() {
    return _.get(routing_, 'host');
};
