class ViewModel {
    constructor() {
        this._pwgContainer = document.getElementById('pwg-container');
        this._alertContainer = document.getElementById('alert-container');
        this._pw = document.getElementById('pw');
        this._copyBtn = document.getElementById('copy');
        this._passwordLength = document.getElementById('paswordLength');
        this._isUpperCase = document.getElementById('isUpperCase');
        this._isLowerCase = document.getElementById('isLowerCase');
        this._isNumber = document.getElementById('isNumber');
        this._isSymbol = document.getElementById('isSymbol');
        this._generatePwBtn = document.getElementById('generate');

        this._upperLatters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this._lowerLatters = 'abcdefghijklmnopqrstuvwxyz';
        this._numbers = '0123456789';
        this._symbols = '!@#$%^&*()_+=';

        this._generatePwBtn.addEventListener('click', this.generatePassword);

        this._copyBtn.addEventListener('click', () => {
            const textarea = document.createElement('textarea');

            if (this._resultPassword) {
                textarea.value = this._resultPassword;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
                return this.renderAlert('Password copied to clickboard');
            } else {
                return this.renderAlert('Plese generate a password');
            }
        })
    }

    getRandomTermFromArray = (array) => {
        return array.length
            ? array[Math.floor(Math.random() * array.length)]
            : null;
    }

    generatePassword = () => {
        if (this._passwordLength.value < 6) {
            return this.renderAlert('Minumum 6 symbols');
        }

        if (this._passwordLength.value > 40) {
            return this.renderAlert('Maximum 40 symbols');
        }

        if (this._passwordLength.value >= 6) {
            const pwLength = this._passwordLength.value;

            let password = '';

            for (let i = 0; i < pwLength; i++) {
                const x = this.getRandomX();
                password += x;
            }

            this._pw.textContent = password;
            this._resultPassword = password;
        }
    }

    getRandomX = () => {
        const xs = [];

        if (this._isUpperCase.checked) {
            xs.push(this.getRandomTermFromArray(this._upperLatters))
        }

        if (this._isLowerCase.checked) {
            xs.push(this.getRandomTermFromArray(this._lowerLatters))
        }

        if (this._isNumber.checked) {
            xs.push(this.getRandomTermFromArray(this._numbers))
        }

        if (this._isSymbol.checked) {
            xs.push(this.getRandomTermFromArray(this._symbols))
        }

        if (xs.length === 0) {
            xs.push(this.getRandomTermFromArray(this._lowerLatters))
        }

        return this.getRandomTermFromArray(xs)
    }

    renderAlert = (message) => {
        this._alertContainer.textContent = '';
        const alert = document.createElement('div');
        alert.classList.add('alert');
        alert.id = 'alert';

        alert.innerHTML = `
            <span>${message}</span>
        `;

        this._alertContainer.appendChild(alert);
        this._alertContainer.style.marginBottom = '15px';
    }
}

class PWGApp {
    constructor() {
        this._viewModel = new ViewModel();
    }
}

const passwordGeneratorApp = new PWGApp();