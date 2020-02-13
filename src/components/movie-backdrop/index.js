import {MoviePoster} from '../movie-poster';
import {IMAGE_SIZES} from '../../constants';

export class MovieBackDrop extends MoviePoster {
    static get key() {
        return 'backdrop_path';
    }

    static getBackdropUrl(movie, size = IMAGE_SIZES.W300) {
        return this.src(size, this.image(movie));
    } 
};

export default MovieBackDrop;