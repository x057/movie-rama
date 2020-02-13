import reducer from './reducer';

export let store = null;

export const initStore = () => {
    store = createStore(reducer);
    return store;
};

function createStore(reducer_) {
    let state;
    let listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer_(state, action);
        listeners.forEach((listener) => listener(action));
    };

    const subscribe = (listener) => {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter((l) => l !== listener);
        };
    };

    dispatch({});

    return {getState, dispatch, subscribe};
};
