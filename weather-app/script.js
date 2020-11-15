class Api {
    constructor(listener) {
        this.listener = listener;
        this._apiKey = 'ad1167f8ce21b923e62919402774c3c6';
        this._mainUrl = `http://api.openweathermap.org/data/2.5/weather?`
    }

    getWeatherByLocation = async (location) => {
        const response = await fetch(`${this._mainUrl}appid=${this._apiKey}&q=${location}`);
        const data = await response.json();
        this.listener({
            children: 'API',
            object: 'View-Model',
            type: 'RENDER-WEATHER',
            body: data
        })
    }
}

class ViewModel {
    constructor(listener) {
        this.listener = listener;
        this._weathersContainer = document.getElementById('weathers')
        this._seacrhForm = document.getElementById('search-form')
        this._seacrhInput = document.getElementById('search-input')

        this._seacrhForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (this._seacrhInput.value) {
                this.listener({
                    children: 'View-Model',
                    object: 'API',
                    type: 'GET-WEATHER-BY-LOCATION',
                    body: {
                        location: this._seacrhInput.value
                    }
                })
            }
        })
    }

    renderWeatherOfLocation = ({
        name,
        base,
        main: { temp },
        sys,
        id,
        weather
    }) => {
        const celsiusTemp = this.fromKelvToCels(temp);

        const weatherEl = document.createElement('div');
        weatherEl.classList.add('weather');

        weatherEl.innerHTML = `
            <h2>${name} ${celsiusTemp}</h2>
            <img class="weather-icon" src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
            <small>${weather[0].main}</small>
        `;

        this._weathersContainer.textContent = '';
        this._weathersContainer.appendChild(weatherEl);
    }

    fromKelvToCels = (kelv) => {
        return `${Math.round(kelv - 273)} °C`
    }
}

class WeatherApp {
    constructor() {
        this._api = new Api(this._eventHandler);
        this._viewModel = new ViewModel(this._eventHandler);

        this._events = [
            {
                eventChildren: 'API',
                objects: [
                    {
                        eventObject: 'View-Model',
                        actions: [
                            {
                                eventType: 'RENDER-WEATHER',
                                execute: (body) => this._viewModel.renderWeatherOfLocation(body)
                            }
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
                                eventType: 'GET-WEATHER-BY-LOCATION',
                                execute: ({ location }) => this._api.getWeatherByLocation(location)
                            }
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
            objects
        }) => {
            if (eventChildren === children) {
                return objects.filter(({ eventObject, actions }) => {
                    if (eventObject === object) {
                        return actions.filter(({ eventType, execute }) => {
                            if (eventType === type) {
                                return execute(body)
                            }
                        })
                    }
                })
            }
        })
    }
}

const weatherApp = new WeatherApp()