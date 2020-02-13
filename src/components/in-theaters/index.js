import {Movies} from '../movies';
import {store, toggleInTheaterExpandedContent} from '../../store';

export class InTheaters extends Movies {
    get movies() {
        const {in_theaters_list} = store.getState();
        return in_theaters_list;
    }

    get expanded() {
        const {in_theaters_expanded} = store.getState();
        return in_theaters_expanded;
    }

    get videos() {
        const {in_theaters_videos} = store.getState();
        return in_theaters_videos;
    }

    get reviews() {
        const {in_theaters_reviews} = store.getState();
        return in_theaters_reviews;
    }

    get similar() {
        const {in_theaters_similar} = store.getState();
        return in_theaters_similar;
    }

    onToggleExpandedContent(id) {
        toggleInTheaterExpandedContent(id);
    }
};

export default InTheaters;