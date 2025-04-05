const searchBox = document.querySelector('.searchBox'); 
const searchBtn = document.querySelector('.searchBtn'); 
const recipeContainer = document.querySelector('.recipe-container'); 
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipeCloseBtn');

// function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();

    recipeContainer.innerHTML = "";
    response.meals.forEach(meal =>{
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe')
        recipeDiv.innerHTML =`
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span>Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span></p>
        `

        const button = document.createElement('button');
        const ingredentsList = fetchIngredents(meal);
        button.textContent = `View Recipe (${ingredentsList.split('<li>').length - 1} ingredients)`;
        recipeDiv.appendChild(button);

        button.addEventListener('click',()=>{
            openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);

    });

}

const fetchIngredents = (meal) => {
    let ingredentsList = "";
    for(let i=1; i<=20; i++){
        const ingredent = meal[`strIngredient${i}`];
        if(ingredent){
            const measure = meal[`strMeasure${i}`];
            ingredentsList += `<li>${measure} ${ingredent}</li>`
        }
        else{
            break;
        }
    }
    return ingredentsList;

}

const openRecipePopup = (meal) => {
    const ingredentsList = fetchIngredents(meal);
    recipeDetailsContent.innerHTML = `
    <h2>${meal.strMeal}</h2>
    <h3>Ingredents:</h3>
    <ul>${ingredentsList}</ul>
    <button class="recipeCloseBtn">Close</button>
    `

    recipeDetailsContent.parentElement.style.display = "block";

    // Add event listener to the close button
    const closeBtn = recipeDetailsContent.querySelector('.recipeCloseBtn');
    closeBtn.addEventListener('click', () => {
        // Hide the popup when the close button is clicked
        recipeDetailsContent.parentElement.style.display = "none";
    });
}

searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
})