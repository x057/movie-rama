describe('Routing:', () => {
    let hash;
    let onLoad;
    let Routing;
    let onScroll;

    beforeEach(() => {
        Routing = require('./index').Routing;

        class Component {}

        Component.prototype.mount = jest.fn();
        Component.prototype.unmount = jest.fn();

        hash = 'test-route';
        onLoad = jest.fn();
        onScroll = jest.fn();

        Routing.setRoute(hash, Component, onLoad, onScroll);
    });

    afterEach(() => {
        jest.resetModules();
    });

    describe('Expected loadRoute behaviour:', () => {
        test('That if a route can be loaded successfully.', () => {
            onLoad.mockImplementation(() => Promise.resolve());
            return expect(Routing.loadRoute('test-route')).resolves.toEqual(hash);
        });

        test('That if a route will not be loaded if prerequisites fail to resolve.', () => {
            onLoad.mockImplementation(() => Promise.reject(new Error()));
            return expect(Routing.loadRoute('test-route')).rejects.toBeInstanceOf(Error);
        });

        test('That if an unknown route is ignored and an error occurs when no default exists.', () => {
            return expect(Routing.loadRoute('unknown-route')).rejects.toBeInstanceOf(Error);
        });

        test('That if an unknown route is ignored and default is loaded.', () => {
            Routing.setDefault(hash);
            return expect(Routing.loadRoute('unknown-route')).resolves.toEqual(hash);
        });
    });

    describe('Expected onScroll execution: ', () => {
        test('That the callback of the active route is called.', () => {
            onLoad.mockImplementation(() => Promise.resolve());
            return Routing.loadRoute('test-route')
                .then(() => {
                    Routing.onScroll();
                    expect(onScroll).toHaveBeenCalled();
                });
        });
    });
});
