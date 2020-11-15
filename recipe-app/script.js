class Api {
    getRandomMeal = async () => {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const { meals } = await response.json()
        const randomMeal = meals[0]
        console.log(randomMeal)
        return randomMeal
    }

    getMealById = async (id) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const { meals } = await response.json()
        return meals[0]
    }

    getMealsByTerm = async (term) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
        const { meals } = await response.json()
        return meals
    }

    getFavMeals = async () => {
        const favMealsIds = await this.getMealsFromLocalStorage();

        const favMeals = [];

        for (let i = 0; i < favMealsIds.length; i++) {
            const meal = await this.getMealById(favMealsIds[i])
            favMeals.push(meal);
        }

        return favMeals;
    }

    addMealToLocalStorage = (mealId) => {
        const mealIds = this.getMealsFromLocalStorage();
        const parseMealIds = JSON.stringify([...mealIds, mealId])

        localStorage.setItem('mealIds', parseMealIds)
    }

    removeMealsFromLocalStorage = (mealId) => {
        const mealIds = this.getMealsFromLocalStorage();
        const parseMealIds = JSON.stringify(mealIds.filter(id => id !== mealId))

        localStorage.setItem('mealIds', parseMealIds)
    }

    getMealsFromLocalStorage = () => {
        const mealIds = localStorage.getItem('mealIds');
        const parseMealIds = JSON.parse(mealIds)

        return parseMealIds === null ? [] : parseMealIds;
    }
}

class ViewModel {
    constructor(listener) {
        this._eventListener = listener;
        this._mealsContainer = document.getElementById('meals');
        this._favoritesContainer = document.getElementById('fav-meals')
        this._searchInput = document.getElementById('search-recipe-input');
        this._searchBtnSuccess = document.getElementById('search-recipe-btn');
        this._mealRecipeInfo = document.getElementById('meal-recipe-info');
        this._closeRecipePopup = document.getElementById('close-recipe-popup');
        this._recipeContent = document.getElementById('recipe-content');

        this._closeRecipePopup.addEventListener('click', (event) => {
            this._mealRecipeInfo.classList.add('hidden');
            this._recipeContent.textContent = '';
        })

        this._searchInput.addEventListener('input', this.renderMealBySearchTerm)
        this._searchBtnSuccess.addEventListener('click', (event) => {
            event.preventDefault();
            if (this._searchInput.value) {
                this.renderMealBySearchTerm(event);
            }
        })
    }

    renderMeal = (mealData, isRandom = false) => {
        const { idMeal, strMeal, strMealThumb } = mealData;
        const meal = document.createElement('div');
        meal.classList.add('meal');
        meal.id = `meal_${idMeal}`;

        const randomRecipeTitle = `
            <span class="random">
                Random Recipe
            </span>
        `;

        meal.innerHTML = `
            <div class="meal-header">
                ${isRandom ? randomRecipeTitle : ''}
                <img alt="${strMeal}" src="${strMealThumb}">
            </div>
            <div class="meal-body">
                <div class="meal-name">
                    <i class="fa fa-concierge-bell meal-icon"></i>
                    <h4>${strMeal}</h4>
                </div>
                <button class="fav-btn">
                    <i class="fa fa-heart addToMy-fav-recipe"></i>
                </button>
            </div>
        `;

        const favBtn = meal.querySelector('.fav-btn');

        favBtn.addEventListener('click', () => {
            if (favBtn.classList.contains('active')) {
                this._favoritesContainer.textContent = '';
                this._eventListener({ object: 'Local-Storage', action: 'remove', id: idMeal })
                favBtn.classList.remove('active');
            } else {
                this._favoritesContainer.textContent = '';
                this._eventListener({ object: 'Local-Storage', action: 'add', id: idMeal })
                favBtn.classList.add('active');
            }

            this._eventListener({ object: 'Favorite-Meals', action: 'load' })
        })

        meal.addEventListener('click', (event) => {
            if (!event.target.classList.contains('addToMy-fav-recipe')) {
                this.renderMealRecipeInfo(mealData)
            }
        })

        this._mealsContainer.appendChild(meal)
    }

    renderFavMeal = (favMeals) => {
        favMeals.forEach((mealData) => {
            const { idMeal, strMeal, strMealThumb } = mealData;
            const favMeal = document.createElement('li');
            favMeal.classList.add('fav-meal');
            favMeal.id = `meal_${idMeal}`;

            favMeal.innerHTML = `
                <img src="${strMealThumb}" alt="${strMeal}">
                <span>${strMeal}</span>
                <button class="delete-favMeal">
                    <i class="fas fa-window-close delete-recipe"></i>
                </button>
            `;

            const favDeleteBtn = favMeal.querySelector('.delete-favMeal');

            favMeal.addEventListener('click', (event) => {
                if (!event.target.classList.contains('delete-recipe')) {
                    this.renderMealRecipeInfo(mealData)
                }
            })

            favDeleteBtn.addEventListener('click', () => {
                this._favoritesContainer.textContent = '';
                this._eventListener({ object: 'Favorite-Meals', action: 'delete', id: idMeal })
                this._eventListener({ object: 'Favorite-Meals', action: 'load' });
            })

            this._favoritesContainer.appendChild(favMeal)
        })
    }

    renderMealBySearchTerm = async (event) => {
        this._mealsContainer.textContent = '';
        event.preventDefault();
        const searchTerm = this._searchInput.value;
        const findsMeals = await this._eventListener({ object: 'Search-Meal', action: 'search', term: searchTerm });

        if (findsMeals) {
            findsMeals.forEach(meal => {
                this.renderMeal(meal);
            })
        }
    }

    renderMealRecipeInfo = (mealData) => {
        const { idMeal, strMeal, strMealThumb, strInstructions, strSource, strYoutube } = mealData;
        const recipeContent = document.createElement('div');

        const ingrediends = [];

        for (let i = 1; i < 20; i++) {
            if (mealData[`strIngredient${i}`]) {
                ingrediends.push(`${mealData[`strIngredient${i}`]} - ${mealData[`strMeasure${i}`]}`);
            } else {
                break;
            }
        }

        recipeContent.innerHTML = `
            <div class="recipe-titles" id="recipe_${idMeal}">
                <img class="recipe-img" src="${strMealThumb}" alt="recipe_${strMeal}">
                <h2 class="recipe-name">${strMeal}</h2>
            </div>
            <div class="recipe-main">
                <h3>Ingredients:</h3>
                <ul class="recipe-ingrediends">
                    ${ingrediends.map((string) => `
                    <li>${string}</li>
                    `).join("")}
                </ul>
                <p>${strInstructions}</p>
                <h4>Links:</h4>
                <div class="source-block">
                    <a href="${strYoutube}" target="_blank">
                        <i class="fab fa-youtube"></i>
                    </a>
                    <a href="${strSource}" target="_blank">
                        <i class="fas fa-link"></i>
                    </a>
                    </div>
            </div>
        `;

        this._recipeContent.appendChild(recipeContent)
        this._mealRecipeInfo.classList.remove('hidden')
    }
}

class RecipeApp {
    constructor() {
        this._api = new Api()
        this._viewModel = new ViewModel(this._eventHandler)

        this.addRandomMeal();
        this.addFavMeals();
    }

    addRandomMeal = async () => {
        const meal = await this._api.getRandomMeal();
        this._viewModel.renderMeal(meal, true)
    }

    addFavMeals = async () => {
        const meals = await this._api.getFavMeals();
        this._viewModel.renderFavMeal(meals)
    }

    _eventHandler = ({ object, action, id, term }) => {
        if (object === 'Local-Storage') {
            if (action === 'add') {
                return this._api.addMealToLocalStorage(id);
            }

            if (action === 'remove') {
                return this._api.removeMealsFromLocalStorage(id);
            }
        }

        if (object === 'Favorite-Meals') {
            if (action === 'load') {
                return this.addFavMeals();
            }

            if (action === 'delete') {
                return this._api.removeMealsFromLocalStorage(id)
            }
        }

        if (object === 'Search-Meal') {
            if (action === 'search') {
                return this._api.getMealsByTerm(term)
            }
        }
    }
}

const recipeApp = new RecipeApp();