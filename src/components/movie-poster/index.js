import _ from 'lodash';
import {html} from 'lighterhtml';

import {PROTOCOL, IMAGE_HOST, IMAGE_SIZES} from '../../constants';

export class MoviePoster {
    static get key() {
        return 'poster_path';
    }

    static src(size, image) {
        return this.isImage(image) ? `${PROTOCOL}//${IMAGE_HOST}/${size}${image}` : '';
    }

    static image(movie) {
        const image = _.get(movie, this.key);
        return this.isImage(image) ? image : null;
    }

    static isImage(image) {
        return (/\.(gif|jpg|jpeg|tiff|png)$/i).test(image);
    }

    static render(movie, size = IMAGE_SIZES.W154) {
        const image = this.image(movie);

        return image ? html`
            <img
                alt='${movie.title}'
                src='${this.src(size, image)}' />` : null;
    }

    static renderThumbnail(movie) {
        return this.render(movie, IMAGE_SIZES.W92);
    }
};

export default MoviePoster;