import {store, initStore} from './store';
import {DEFAULT_ROUTE} from '../constants'
import * as network from '../libs/network';

import {setRoute, setSearchQuery, fetchGenres, fetchSearchPage} from './actions';

describe('actions:', () => {
    beforeEach(() => {
        initStore();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('The default store state: ', () => {
        test(('That the store was initialized.'), () => {
            expect(store).not.toBe(null);
        });

        test(('That default route is set.'), () => {
            const {route} = store.getState();
            expect(route).toBe(DEFAULT_ROUTE);
        });

        test(('That the error list is empty.'), () => {
            const {errors} = store.getState();
            expect(errors).not.toBe(DEFAULT_ROUTE);
        });
    });

    describe('Basic actions: ', () => {
        test('That route can be set as expected.', () => {
            const test = '*';
            setRoute(test);
            const {route} = store.getState();
            expect(route).toBe(test);
        });

        test('That fetched genres are kept in state.', () => {
            const genres = [1, 2, 3];
            jest.spyOn(network, 'fetchJson').mockImplementation(() => Promise.resolve({genres}));
            return fetchGenres().then(() => expect(store.getState().genres).toEqual(genres));
        });

        test('That fetched genres are kept intact but errors are populated in the state.', () => {
            jest.spyOn(network, 'fetchJson').mockImplementation(() => Promise.reject(new Error()));
            expect.assertions(2);
            return fetchGenres()
                .catch(() => {
                    const {genres} = store.getState();
                    const {errors} = store.getState();
                    expect(genres.length).toEqual(0);
                    expect(errors.length).toEqual(1);
                });
        });
    });

    describe('Management of search pages state: ', () => {
        let total_pages;

        beforeEach(() => {
            jest.spyOn(network, 'fetchJson')
                .mockImplementationOnce(() => Promise.resolve({page: 1, total_pages, results: [1, 2, 3]}))
                .mockImplementationOnce(() => Promise.resolve({page: 2, total_pages, results: [4, 5, 6]}));
        });

        test('That fetched search pages are kept in state as expected.', () => {
            total_pages = 5;

            return fetchSearchPage()
                .then(() => {
                    const {search_list} = store.getState();
                    expect(search_list).toEqual([1, 2, 3]);
                    return fetchSearchPage();
                })
                .then(() => {
                    const {search_list} = store.getState();
                    expect(search_list).toEqual([1, 2, 3, 4, 5, 6]);
                });
        });

        test('That no futher search pages are to be fetched from the api if all pages are retrieved and in state.', () => {
            total_pages = 1;

            return fetchSearchPage()
                .then(() => {
                    const {search_list} = store.getState();
                    expect(search_list).toEqual([1, 2, 3]);
                    return fetchSearchPage();
                })
                .then(() => {
                    const {search_list} = store.getState();
                    expect(search_list).toEqual([1, 2, 3]);
                });
        });

        test('That all search pages are cleared when the search query is being updated.', () => {
            total_pages = 10;

            return fetchSearchPage()
                .then(() => {
                    const {search_list} = store.getState();
                    expect(search_list).toEqual([1, 2, 3]);
                    return setSearchQuery();
                })
                .then(() => {
                    const {search_list} = store.getState();
                    expect(search_list).toEqual([]);
                });
        });
    });
});