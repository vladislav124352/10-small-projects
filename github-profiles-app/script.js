class Api {
    constructor(listener) {
        this._listener = listener
        this._userAPI = 'https://api.github.com/users';
    }

    getUser = async (userName) => {
        const response = await fetch(`${this._userAPI}/${userName}`)
        const data = await response.json();
        this._listener({
            children: 'API',
            object: 'View-Model',
            type: 'REDNER-USER',
            body: data
        })
    }

    getUserRepos = async (userName) => {
        const response = await fetch(`${this._userAPI}/${userName}/repos`)
        const data = await response.json();
        this._listener({
            children: 'API',
            object: 'View-Model',
            type: 'REDNER-REPOS',
            body: data
        })
    }
}

class ViewModel {
    constructor(listener) {
        this._listener = listener
        this._main = document.getElementById('main')
        this._form = document.getElementById('search-form')
        this._searchInput = document.getElementById('search-input')

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();

            let inputText = this._searchInput.value

            if (inputText) {
                this._listener({
                    children: 'View-Model',
                    object: 'API',
                    type: 'GET-USER',
                    body: {
                        userName: inputText
                    }
                })

                this._listener({
                    children: 'View-Model',
                    object: 'API',
                    type: 'GET-REPOS',
                    body: {
                        userName: inputText
                    }
                })
            }
        })
    }

    renderCard = ({
        login,
        name,
        html_url,
        bio,
        avatar_url,
        followers,
        following,
        public_repos
    }) => {

        this._main.textContent = '';

        if (login) {
            const cardHTML = `
                <div class="card">
                    <div class="avatar-block">
                        <img class="avatar" src="${avatar_url}" alt="${name || login}">
                    </div>
                    <div class="info-block">
                        <div class="login-block">
                            <h2>
                                <a target="_blank" href="${html_url}">${login}</a>
                            </h2>
                        </div>
                        <div class="description">
                            <span>${bio || ''}</span>
                        </div>
                        <ul class="info">
                            <li>
                                <div class="icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                ${followers}
                            </li>
                            <li>
                                <div class="icon">
                                    <i class="fas fa-user-friends"></i>
                                </div>
                                ${following}
                            </li>
                            <li>
                                <div class="icon">
                                    <i class="fas fa-code"></i>
                                </div>
                            ${public_repos}
                            </li>
                        </ul>
                        <div class="repos" id="repos">
                        </div>
                    </div>
                </div>
            `;

            this._main.innerHTML = cardHTML;
        } else {
            this._main.innerHTML = `
                <div class="card">
                    <h2>Opps. User not found</h2>
                </div>
            `;
        }
    }

    renderReposToCard = (repos) => {
        console.log(repos)
        const reposList = document.getElementById('repos');

        [...repos]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 10)
            .forEach(({ clone_url, name }) => {
                const repoEl = document.createElement('span');
                repoEl.classList.add('repo')
                repoEl.innerHTML = `
                    <a target="_blank" href="${clone_url}">${name}</a>
                `;
                reposList.appendChild(repoEl);
            })
    }
}

class GithubProfilesApp {
    constructor() {
        this._api = new Api(this._eventHandler)
        this._viewModel = new ViewModel(this._eventHandler)

        this._events = [
            {
                eventChildren: 'API',
                objects: [
                    {
                        eventObject: 'View-Model',
                        actions: [
                            {
                                eventType: 'REDNER-USER',
                                execute: (body) => this._viewModel.renderCard(body)
                            },
                            {
                                eventType: 'REDNER-REPOS',
                                execute: (body) => this._viewModel.renderReposToCard(body)
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
                                eventType: 'GET-USER',
                                execute: ({ userName }) => this._api.getUser(userName)
                            },
                            {
                                eventType: 'GET-REPOS',
                                execute: ({ userName }) => this._api.getUserRepos(userName)
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

const githubProfilesApp = new GithubProfilesApp()