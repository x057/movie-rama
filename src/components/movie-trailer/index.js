import {html} from 'lighterhtml';

import {PROTOCOL, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_HOST} from '../../constants';

export class MovieTrailer {
    static render(video, tabindex = 5, width = VIDEO_WIDTH, height = VIDEO_HEIGHT) {
        const {key} = video;
        return key ? html`
            <object tabindex='${tabindex}' width='${width}' height='${height}'>
                <param name='movie' value='${PROTOCOL}//${VIDEO_HOST}/${key}'></param>
                <param name='allowscriptaccess' value='always'></param>
                <param name='allowFullScreen' value='true'></param>
                <embed
                    src='${PROTOCOL}//${VIDEO_HOST}/${key}'
                    type='application/x-shockwave-flash'
                    allowscriptaccess='always'
                    allowfullscreen='true'
                    width='${width}'
                    height='${height}'></embed>
            </object>` : null;
    }
};

export default MovieTrailer;