export const PROTOCOL = 'https:';

export const API_KEY = 'bc50218d91157b1ba4f142ef7baaa6a0';

/**
 * API host
 * @type {string}
 */
export const API_HOST = 'api.themoviedb.org/3';

/**
 * Image host
 * @type {string}
 */
export const IMAGE_HOST = 'image.tmdb.org/t/p';

/**
 * Map of available image sizes
 * @type {Object}
 */
export const IMAGE_SIZES = {
    W92: 'w92',
    W154: 'w154',
    W185: 'w185',
    W300: 'w300',
    W342: 'w342',
    W500: 'w500',
    W780: 'w780',
    W1280: 'w1280',
    ORIGINAL: 'original'
};

/**
 * Type of video to use
 * @type {string}
 */
export const VIDEO_TYPE = 'Trailer';

/**
 * Site of video to use
 * @type {string}
 */
export const VIDEO_SITE = 'YouTube';

/**
 * Video oject width
 * @type {number}
 */
export const VIDEO_WIDTH = 240;

/**
 * Video oject height
 * @type {number}
 */
export const VIDEO_HEIGHT = 3 * VIDEO_WIDTH / 4;

/**
 * Video host
 * @type {string}
 */
export const VIDEO_HOST = 'www.youtube.com/v';

/**
 * Map of routes
 * @type {Object}
 */
export const ROUTE_HASHES = {
    IN_THEATERS: 'in_theaters',
    SEARCH: 'search'
};

/**
 * The default route
 * @type {string}
 */
export const DEFAULT_ROUTE = ROUTE_HASHES.IN_THEATERS;

export const ROUTE_STATE_TEMPLATE = {
    /**
    * The query in the search field for a route
    * @type {String}
    */
    query: '',

    /**
    * List of collected movies from the pages of a route
    * @type {Array}
    */
    list: [],

    /**
    * List of pages collected while paginating/scrolling on a route
    * @type {Array}
    */
    pages: [],

    /**
    * List of video pages per movie as collected when expanding movie content on every route
    * @type {Array}
    */
    videos: [],

    /**
    * List of review pages per movie as collected when expanding movie content on every route
    * @type {Array}
    */
    reviews: [],

    /**
    * List of similar movie pages per movie as collected when expanding movie content on every route
    * @type {Array}
    */
    similar: [],

    /**
    * List of expanded state on every movie per route
    * @type {Array}
    */
    expanded: [],
};
