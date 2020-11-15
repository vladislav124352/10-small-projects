class Api {
    constructor(listener) {
        this._listener = listener
    }

    updateLocalStorage = (todos) => {
        return localStorage.setItem('todos', JSON.stringify(todos));
    }

    getTodos = () => {
        return JSON.parse(localStorage.getItem('todos'));
    }
}

class ViewModel {
    constructor(listener) {
        this._listener = listener;
        this._form = document.getElementById('form');
        this._input = document.getElementById('input');
        this._todos = document.getElementById('todos');

        this._todosLS = this._listener({ children: 'View-Model', object: 'Local-Storage', type: 'GET' })

        if (this._todosLS) {
            this._todosLS.forEach(todo => {
                this.addTodo(todo)
            })
        }

        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.addTodo({ text: this._input.value, completed: false });
        });
    }

    addTodo = ({ text, completed }) => {
        if (text) {

            const todo = document.createElement('li');
            todo.classList.add('todo');

            if (completed) {
                todo.classList.toggle('completed');
            }

            todo.insertAdjacentText('afterbegin', text);

            todo.addEventListener('click', () => {
                todo.classList.toggle('completed');
                this.updateNote();
            })

            todo.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                todo.remove();
                this.updateNote();
            })

            this._todos.appendChild(todo);
            this._input.value = '';
            this.updateNote();
        }
    }

    updateNote = () => {
        const allTodos = document.querySelectorAll('li');

        if (allTodos.length) {
            const todos = [];

            allTodos.forEach(note => {
                todos.push({
                    text: note.textContent,
                    completed: note.classList.contains('completed')
                })
                this._listener({ children: 'View-Model', object: 'Local-Storage', type: 'UPDATE', body: todos })
            })
        } else {
            this._listener({ children: 'View-Model', object: 'Local-Storage', type: 'UPDATE', body: [] })
        }
    }
}

class TodosApp {
    constructor() {
        this._api = new Api(this._eventHandler)
        this._viewModel = new ViewModel(this._eventHandler)
    }

    _eventHandler = ({ children, object, type, body }) => {
        if (children === 'View-Model') {
            if (object === 'Local-Storage') {
                if (type === 'UPDATE') {
                    return this._api.updateLocalStorage(body)
                }

                if (type === 'GET') {
                    return this._api.getTodos();
                }
            }
        }
    }
}

const todosApp = new TodosApp();