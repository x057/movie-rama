import {Movies} from '../movies';
import {store, toggleSearchExpandedContent} from '../../store';

export class Search extends Movies {
    get movies() {
        const {search_list} = store.getState();
        return search_list;
    }

    get expanded() {
        const {search_expanded} = store.getState();
        return search_expanded;
    }

    get videos() {
        const {search_videos} = store.getState();
        return search_videos;
    }

    get reviews() {
        const {search_reviews} = store.getState();
        return search_reviews;
    }

    get similar() {
        const {search_similar} = store.getState();
        return search_similar;
    }

    onToggleExpandedContent(id) {
        toggleSearchExpandedContent(id);
    }
};

export default Search;