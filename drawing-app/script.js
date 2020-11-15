class ViewModel {
    constructor(listener) {
        this._listener = listener;
        this._canvas = document.getElementById('canvas');
        this._tollbox = document.getElementById('tollbox');
        this._increaseBtn = document.getElementById('increase');
        this._decreaseBtn = document.getElementById('decrease');
        this._clearBtn = document.getElementById('clear');
        this._sizeView = document.getElementById('size');
        this._colorPicker = document.getElementById('color-picker');
        this._context = this._canvas.getContext('2d');

        this.size = 10;
        this.color = this._colorPicker.value;
        this._tollbox.style.backgroundColor = this.color;
        this._sizeView.textContent = this.size;
        this._context.lineWidth = this.size;
        this._isPressed = false;
        this.lineX;
        this.lineY;

        this._canvas.addEventListener('mousedown', ({ offsetX, offsetY }) => {
            this._isPressed = true;
            this.lineX = offsetX;
            this.lineY = offsetY;
        })

        this._canvas.addEventListener('mousemove', ({ offsetX, offsetY }) => {
            if (this._isPressed) {
                const x2 = offsetX;
                const y2 = offsetY;
                this.drawCircle({ x: x2, y: y2 })
                this.drawLine({
                    x1: this.lineX,
                    y1: this.lineY,
                    x2,
                    y2
                })
                this.lineX = x2;
                this.lineY = y2;
            }
        })

        this._canvas.addEventListener('mouseup', (event) => {
            this._isPressed = false;
            this.lineX = null;
            this.lineY = null;
        })

        this._decreaseBtn.addEventListener('click', (event) => {
            this.size += 2;
            if (this.size > 50) {
                this.size = 50;
            }
            this._sizeView.textContent = this.size;
            this._context.lineWidth = this.size;
        })

        this._increaseBtn.addEventListener('click', () => {
            this.size -= 2;
            if (this.size < 5) {
                this.size = 5;
            }
            this._sizeView.textContent = this.size;
            this._context.lineWidth = this.size;
        })

        this._clearBtn.addEventListener('click', () => {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height)
        })

        this._colorPicker.addEventListener('change', () => {
            this.color = this._colorPicker.value;
            this._tollbox.style.backgroundColor = this.color;
        })
    }

    drawCircle = ({ x, y }) => {
        this._context.beginPath()
        this._context.arc(x, y, this.size, 0, Math.PI * 2);
        this._context.fillStyle = this.color;
        this._context.fill();
    }

    drawLine = ({ x1, y1, x2, y2 }) => {
        this._context.beginPath()
        this._context.moveTo(x1, y1);
        this._context.lineTo(x2, y2);
        this._context.strokeStyle = this.color;
        this._context.lineWidth = this.size * 2;
        this._context.stroke();
    }
}

class DrawingApp {
    constructor() {
        this._viewModel = new ViewModel()
    }
}

const drawingApp = new DrawingApp()