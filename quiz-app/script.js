class QuizApp {
    constructor(quizData) {
        this._quizData = quizData

        this._quizContent = document.getElementById('quiz-content');
        this._questionEl = document.getElementById('question');
        this._answersEls = document.querySelectorAll('.quiz-answer');
        this._aText = document.getElementById('a-text');
        this._bText = document.getElementById('b-text');
        this._cText = document.getElementById('c-text');
        this._dText = document.getElementById('d-text');
        this._finishQuiz = document.getElementById('finish-quiz-content');
        this._rightAnswers = document.getElementById('right-answers');

        this._currentQuiz = 0;
        this._correctlyAnswer = 0;

        this._submitBtn = document.getElementById('submit');
        this._submitBtn.addEventListener('click', this._submitAnswer);
    }

    _getSelectedCheckbox = () => {
        let answer;

        this._answersEls.forEach((answersEl) => {
            if (answersEl.checked) {
                answer = answersEl.id;
            }
        })

        return answer;
    }

    _deselectAnswers = () => {
        return this._answersEls.forEach((answersEl) => {
            answersEl.checked = false;
        });
    }

    _submitAnswer = () => {
        const currentAnswer = this._getSelectedCheckbox();
        const isNotEndQuiz = (this._currentQuiz + 1) < this._quizData.length;
        const isCorrectAnswer = currentAnswer === this._quizData[this._currentQuiz].answers.correct;

        if (currentAnswer) {

            if (isCorrectAnswer) {
                this._correctlyAnswer++;
            }

            this._currentQuiz++;

            if (isNotEndQuiz) {
                this.renderQuiz();
            } else {
                this._renderFunishQuiz();
            }
        }
    }

    _reloadQuizTest = () => {
        this._currentQuiz = 0;
        this._correctlyAnswer = 0;
        this._finishQuiz.style.display = 'none';
        this._quizContent.style.display = 'block';
        this._submitBtn.removeEventListener('click', this._reloadQuizTest);
        this._submitBtn.addEventListener('click', this._submitAnswer);
        this._submitBtn.textContent = 'Submit';
        this.renderQuiz();
    }

    renderQuiz = () => {
        this._deselectAnswers()

        const {
            question,
            answers: { a, b, c, d }
        } = this._quizData[this._currentQuiz];

        this._questionEl.textContent = question;
        this._aText.textContent = a;
        this._bText.textContent = b;
        this._cText.textContent = c;
        this._dText.textContent = d;
    }

    _renderFunishQuiz = () => {
        this._submitBtn.removeEventListener('click', this._submitAnswer);
        this._submitBtn.addEventListener('click', this._reloadQuizTest);
        this._submitBtn.textContent = 'Try again!'
        this._quizContent.style.display = 'none';
        this._finishQuiz.style.display = 'block';
        this._rightAnswers.textContent = `You asnwered correctly at ${this._correctlyAnswer}/${this._quizData.length} questions`;
    }
}

const quizData = [
    {
        question: 'How old is Lorin?',
        answers: { a: '10', b: '17', c: '26', d: '110', correct: 'c' }
    },
    {
        question: 'What si the most used programming language in 2020?',
        answers: { a: 'Java', b: 'C', c: 'Python', d: 'JavaScript', correct: 'd' }
    },
    {
        question: 'Who is the president of Russian?',
        answers: {
            a: 'Vladimir Putin',
            b: 'Dmitry Medvedev',
            c: 'Donald Trump',
            d: 'Alexander Lukashenko',
            correct: 'a'
        }
    },
    {
        question: 'What does HTML stand for?',
        answers: {
            a: 'Hypertext Markup Language',
            b: 'Cascading Style Sheet',
            c: 'JavaScript Object Notation',
            d: 'Application Programming Interface',
            correct: 'a'
        }
    },
    {
        question: 'What year was JavaScript launched?',
        answers: {
            a: '1996',
            b: '1995',
            c: '1994',
            d: 'none of the above',
            correct: 'b'
        }
    },
    {
        question: 'What is the name of the author of this application?',
        answers: {
            a: 'Vlad Polishchuk',
            b: 'Frorin Pop',
            c: 'Joe Biden',
            d: "I don\\'t know",
            correct: 'a'
        }
    }
]

const quizApp = new QuizApp(quizData);
quizApp.renderQuiz();