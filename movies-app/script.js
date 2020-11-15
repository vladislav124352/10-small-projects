class Api {
    constructor(eventListener) {
        this._eventListener = eventListener
        this._APIKEY = '04c35731a5ee918f014970082a0088b1';
        this._APIURL = 'https://api.themoviedb.org/3/';
        this._APIIMAGE = 'https://image.tmdb.org/t/p/w1280';
        this._APISEARCH = 'search/movie?&api_key=<key>&query=<term>';
        this._APIMOVIESURL = 'discover/movie?sort_by=<TERM>&with_cast=<N>&api_key=<key>&page=<N>';
    }

    getMoviesByUrl = async (url) => {
        const response = await fetch(url);
        const { results } = await response.json();
        return results
    }

    getFavMovies = async ({ page = 1 }) => {
        const data = await this.getMoviesByUrl(`${this._APIURL}discover/movie?api_key=${this._APIKEY}&page=${page}`)

        this._eventListener({
            children: 'API',
            object: 'View-Model',
            type: 'RENDER',
            body: {
                posters: data,
                main_img_url: this._APIIMAGE
            }
        })
    }

    getMoviesByTerm = async ({ value }) => {
        const data = await this.getMoviesByUrl(`${this._APIURL}search/movie?&api_key=${this._APIKEY}&query=${value}`)

        this._eventListener({
            children: 'API',
            object: 'View-Model',
            type: 'RENDER',
            body: {
                posters: data,
                main_img_url: this._APIIMAGE
            }
        })
    }
}

class ViewModel {
    constructor(eventListener) {
        this._eventListener = eventListener;
        this._moviesContainer = document.getElementById('movies')
        this._form = document.getElementById('search-form');
        this._searchInput = document.getElementById('search-input');

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            const valueTerm = this._searchInput.value;
            if (valueTerm) {
                this._eventListener({
                    children: 'View-Model',
                    object: 'API',
                    type: 'SEARCH-BY-MOVIES',
                    body: {
                        value: valueTerm
                    }
                })
            }
        })
    }

    renderPoster = ({ posters, main_img_url }) => {

        this._moviesContainer.textContent = '';

        posters.forEach(({ poster_path, title, vote_average, overview }) => {
            const movie = document.createElement('div');
            movie.classList.add('movie')

            movie.innerHTML = `
                <div class="movie-image">
                    <img src="${main_img_url}${poster_path}" alt="${title}">
                </div>
                <div class="movie-info-content">
                    <div class="movie-info">
                        <h3>${title}</h3>
                        <span class="${this._getClassByRating(vote_average)}">${vote_average}</span>
                    </div>
                    <div id="overview" class="movie-overview">
                        <h4>Overview:</h4>
                        <span>${overview}</span>
                    </div>
                </div>
            `;

            this._moviesContainer.appendChild(movie);
        })
    }

    _getClassByRating = (vote) => {
        if (vote >= 8) {
            return 'high-overage'
        } else if (vote >= 5) {
            return 'medium-overage'
        } else {
            return 'low-overage'
        }
    }
}

class MoviesApp {
    constructor() {
        this._api = new Api(this._eventHandler);
        this._viewModel = new ViewModel(this._eventHandler);
        this._api.getFavMovies({ page: 1 });

        this._events = [
            {
                eventChildren: 'API',
                objects: [
                    {
                        eventObject: 'View-Model',
                        actions: [
                            {
                                eventType: 'RENDER',
                                execute: (body) => this._viewModel.renderPoster(body)
                            },
                        ]
                    },
                ]
            },
            {
                eventChildren: 'View-Model',
                objects: [
                    {
                        eventObject: 'API',
                        actions: [
                            {
                                eventType: 'SEARCH-BY-MOVIES',
                                execute: (body) => this._api.getMoviesByTerm(body)
                            },
                        ]
                    },
                ]

            }
        ];
    }

    _eventHandler = ({
        children,
        object,
        type,
        body
    }) => {
        return this._events.filter(({
            eventChildren,
            objects: [
                {
                    eventObject,
                    actions: [
                        {
                            eventType,
                            execute
                        }
                    ]
                }
            ]
        }) => eventChildren === children
                ? eventObject === object
                    ? eventType === type
                        ? execute(body)
                        : false
                    : false
                : false
        )
    }
}

const moviesApp = new MoviesApp();