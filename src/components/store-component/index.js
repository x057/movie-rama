import {render, html} from 'lighterhtml';

import {store, STORE_ACTIONS} from '../../store';

export class StoreComponent {
    /**
     * List of store actions to which the component ought to react to
     * @returns {Array<string>}
     */
    get actions() {
        return Object.values(STORE_ACTIONS);
    }

    constructor(host) {
        /**
         * Host element where the component content is going to be rendered
         * @type {Element}
         */
        this.host = host;

        /**
         * Map of subscriptions
         * @type {Object}
         */
        this.subscriptions = {};

        this.init();
    }

    mount() {
        render(this.host, html`<div>${Date.now()}</div>`);
    }

    unmount() {
        Object.entries(this.subscriptions)
            .forEach(([key, unsubscribe]) => unsubscribe());

        render(this.host, html`...`);
    }

    /**
     * Initializes various props on construction
     * @private
     */
    init() {
        this.subscriptions.store = store.subscribe((action) => this.onStoreDispatch(action));
    }

    /**
     * Callback to be executed whenever store dispatches occur
     * @param  {Object} action
     * @private
     */
    onStoreDispatch(action) {
        const {type} = action;

        if (this.actions.includes(type)) {
            this.mount();
        }
    }
}

export default StoreComponent;