class Api {
    constructor(listener) {
        this._listener = listener;
        this._notes = JSON.parse(localStorage.getItem('notes'));

        if (this._notes) {
            this._notes.forEach((note) => {
                this._listener({ children: 'Api', object: 'View-Model', type: 'UPDATE', body: { message: note } })
            })
        }
    }

    updateLocalStorage = () => {
        const notesContent = document.querySelectorAll('.form');

        const notes = [];

        notesContent.forEach(({ value }) => {
            notes.push(value);
        });

        localStorage.setItem('notes', JSON.stringify(notes));
    }
}

class ViewModel {
    constructor(listener) {
        this._listener = listener;
        this._addNote = document.getElementById('add-note')

        this._addNote.addEventListener('click', () => {
            this.addNewNote();
        })
    }

    addNewNote = (noteContent = '') => {
        const note = document.createElement('div');
        note.classList.add('note')

        note.innerHTML = `
            <div class="tools">
                <button class="fas fa-edit edit"></button>
                <button class="fas fa-trash-alt delete"></button>
            </div>
            <main class="main hidden"></main>
            <textarea class="form"></textarea>
        `;

        document.body.appendChild(note)

        const main = note.querySelector('.main');
        const textarea = note.querySelector('textarea');
        const editBtn = note.querySelector('.edit');
        const deleteBtn = note.querySelector('.delete');

        if (noteContent) {
            textarea.value = noteContent;
            main.innerHTML = marked(noteContent);
            main.classList.toggle('hidden');
            textarea.classList.toggle('hidden');
        }

        editBtn.addEventListener('click', () => {
            main.classList.toggle('hidden');
            textarea.classList.toggle('hidden');
        })

        deleteBtn.addEventListener('click', () => {
            note.remove();
            this._listener({ children: 'View-Model', object: 'Local-Storage', type: 'UPDATE' })
        })

        textarea.addEventListener('input', ({ target: { value } }) => {
            main.innerHTML = marked(value);
            this._listener({ children: 'View-Model', object: 'Local-Storage', type: 'UPDATE' })
        })
    }
}

class NotesApp {
    constructor() {
        this._viewModel = new ViewModel(this.eventHandler);
        this._api = new Api(this.eventHandler);
    }

    eventHandler = ({ children, object, type, body }) => {
        if (children === 'Api') {
            if (object === 'View-Model') {
                if (type === 'UPDATE') {
                    this._viewModel.addNewNote(body.message)
                }
            }
        }

        if (children === 'View-Model') {
            if (object === 'Local-Storage') {
                if (type === 'UPDATE') {
                    this._api.updateLocalStorage()
                }
            }
        }
    }
}

const notesApp = new NotesApp();