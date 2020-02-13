import './styles.scss';

import _ from 'lodash';
import {render, html} from 'lighterhtml';

import {store} from '../../store';
import {MoviePoster} from '../movie-poster';
import {MovieTrailer} from '../movie-trailer';
import {MovieBackDrop} from '../movie-backdrop';
import {StoreComponent} from '../store-component';
import {VIDEO_TYPE, VIDEO_SITE} from '../../constants';

export class Movies extends StoreComponent {
    /**
     * Retrieves videos from a list based on id, type and site
     * @param   {number} id
     * @param   {Array<Object>} videos
     * @param   {string=} type
     * @param   {string=} site
     * @returns {Array<Object>}
     * @static
     */
    static getMovieTrailers(id, videos, type = VIDEO_TYPE, site = VIDEO_SITE) {
        return _.chain(videos)
            .find({id})
            .get('pages')
            .map('results')
            .flatten()
            .filter({type, site})
            .valueOf();
    }

    /**
     * Retrieves review entries from a list based on id
     * @param   {number} id
     * @param   {Array<Object>} reviews
     * @param   {number=} max
     * @returns {Array<Object>}
     * @static
     */
    static getMovieReviews(id, reviews, max = 2) {
        return _.chain(reviews)
            .find({id})
            .get('pages')
            .map('results')
            .flatten()
            .take(max)
            .valueOf();
    }

    /**
     * Retrieves similar movie entries from a list based on id
     * @param   {number} id
     * @param   {Array<Object>} similar
     * @param   {number=} max
     * @returns {Array<Object>}
     * @static
     */
    static getSimilarMovies(id, similar, max = 10) {
        return _.chain(similar)
            .find({id})
            .get('pages')
            .map('results')
            .flatten()
            .take(max)
            .valueOf();
    }

    get namespace() {
        return 'movies';
    }

    get genres() {
        const {genres} = store.getState();
        return genres;
    }

    get movies() {
        return [];
    }

    get expanded() {
        return [];
    }

    get videos() {
        return [];
    }

    get reviews() {
        return [];
    }

    get similar() {
        return [];
    }

    mount() {
        render(this.host, html`
        <ul class='${this.namespace}-list'>
            ${this.movies.map((movie) => this.renderMovie(movie))}
        </ul>`);
    }

    renderMoviePoster(movie) {
        return html`<div
            class='${this.namespace}-list-item-poster'
            tabindex='5'
            onkeypress=${() => this.onToggleExpandedContent(movie.id)}
            onclick=${() => this.onToggleExpandedContent(movie.id)}>${MoviePoster.render(movie) || ''}</div>`;
    }

    renderYear(movie) {
        return _.chain(movie)
            .get('release_date')
            .split('-')
            .first()
            .valueOf();
    }

    renderMovieTrailers(movie) {
        const {id} = movie;

        const videos = Movies.getMovieTrailers(id, this.videos);

        return html`
            <div class='${this.namespace}-trailer-list ${this.namespace}-list-item-expanded-content-section'>
                <h1>Trailers</h1>
                ${_.size(videos) ? _.chain(videos).map((video) => MovieTrailer.render(video)).compact().valueOf() : html`<p>No trailers found on ${VIDEO_SITE}</p>`}
            </div>`;
    }

    renderMovieReviews(movie) {
        const {id} = movie;

        const reviews = Movies.getMovieReviews(id, this.reviews);

        return html`
            <div class='${this.namespace}-review-list ${this.namespace}-list-item-expanded-content-section'>
                <h1>Reviews</h1>
                ${_.size(reviews) ? reviews.map(({content}) => html`<p>${content}</p>`) : html`<p>No reviews found</p>`}
            </div>`;
    }

    renderSimilarMovies(movie) {
        const {id} = movie;

        const similar = Movies.getSimilarMovies(id, this.similar);

        return html`
            <div class='${this.namespace}-similar-list ${this.namespace}-list-item-expanded-content-section'>
                <h1>Similar movies</h1>
                ${_.size(similar) ? _.chain(similar).map((movie) => MoviePoster.renderThumbnail(movie)).compact().valueOf() : html`<p>No similar movies found</p>`}
            </div>`;
    }

    isExpandedMovie(movie) {
        const {id} = movie;
        const {expanded} = _.chain(this.expanded).find({id}).defaults({expanded: false}).valueOf();
        return expanded;
    }

    renderExpandedContent(movie) {
        return html`
            <div
                class='${this.namespace}-list-item-expanded-content ${this.isExpandedMovie(movie) ? 'expanded' : ''}'>
                ${this.renderMovieTrailers(movie)}
                ${this.renderMovieReviews(movie)}
                ${this.renderSimilarMovies(movie)}
            </div>`;
    }

    renderGenreTags(movie) {
        return _.chain(movie)
            .get('genre_ids')
            .map((id) => _.find(this.genres, {id}))
            .compact()
            .map(({name}) => html`<span class='${this.namespace}-genre-tag'>${name}</span>`)
            .valueOf();
    }

    renderMainTextBottom(movie) {
        return html`
            <div class='${this.namespace}-list-item-main-text-bottom'>
                <div
                    tabindex='5'
                    class='${this.namespace}-list-toggle-expanded-content ${this.isExpandedMovie(movie) ? 'expanded' : ''}'
                    onkeypress=${() => this.onToggleExpandedContent(movie.id)}
                    onclick=${() => this.onToggleExpandedContent(movie.id)}></div>
                <div class='${this.namespace}-list-genre-tags'>
                    ${this.renderGenreTags(movie)}
                </div>
            </div>`;
    }

    renderMainText(movie) {
        return html`
            <div class='${this.namespace}-list-item-main-text'>
                <div
                    class='${this.namespace}-list-item-main-text-top'>
                    <h1>${movie.title}</h1>
                    <h2><i>Year of release:</i> ${this.renderYear(movie)} <i>Rating:</i> ${movie.vote_average}</h2>
                    <p>${movie.overview}</p>
                </div>
                ${this.renderMainTextBottom(movie)}
            </div>`;
    }

    renderMainContent(movie) {
        const style = {
            ['background-image']: `url('${MovieBackDrop.getBackdropUrl(movie)}')`
        };

        return html`
            <div
                style=${style}
                class='${this.namespace}-list-item-main-content-backdrop'>
                <div 
                    class='${this.namespace}-list-item-main-content'>
                    ${this.renderMoviePoster(movie)}
                    ${this.renderMainText(movie)}
                </div>
                ${this.renderExpandedContent(movie)}
            </div>`;
    }

    renderMovie(movie) {
        return movie ? html`
            <li
                data-id='${movie.id}'
                class='${this.namespace}-list-item'>
                ${this.renderMainContent(movie)}
            </li>` : html`...`;
    }

    onToggleExpandedContent(id) {
        console.log(`Toggled expanded context on movie ${id}...`);
    }
};

export default Movies;