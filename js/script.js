const recipeContainer = document.getElementById('recipe-container');
let modalContent = document.querySelector(".modal-content");
let ingredientsContainer = document.querySelector(".ingredients-content");
let directionsContainer = document.querySelector(".directions-content");
const loadMoreBtn = document.getElementById('load-more-btn');
const modal = document.querySelector(".modal-overlay");
const modalWindow = document.querySelector(".modal-wrapper");
const closeBtn = document.querySelector(".close-modal-btn");


let name;
let startingIndex = 0;
let endingIndex = 5;
let recipeDataArr = [];
let recipeModalArr = [];
let directions = [];
let ingredients = [];

let mask = document.querySelector('.mask');

fetch('https://jellybellywikiapi.onrender.com/api/Recipes') 
    .then((res) => res.json())
    .then((data) => {
        recipeDataArr = data.items;
        displayRecipes(recipeDataArr.slice(startingIndex, endingIndex));  
      })
    .catch(
        (err) => console.error(`There was an error: ${err}`));
      


fetch('https://jellybellywikiapi.onrender.com/api/Recipes?pageIndex=2')
    .then((res) => res.json())
    .then((data) => {
        recipeDataArr = data.items;
        displayRecipes(recipeDataArr.slice(startingIndex, endingIndex));  
      })
    .catch(
        (err) => console.error(`There was an error: ${err}`));


fetch('https://jellybellywikiapi.onrender.com/api/Recipes?pageIndex=3')
    .then((res) => res.json())
    .then((data) => {
        recipeDataArr = data.items;
        displayRecipes(recipeDataArr.slice(startingIndex, endingIndex));  
      })
    .catch(
        (err) => console.error(`There was an error: ${err}`));



const getDataById = (id) => {
    var isLoad = false;
    mask.classList.remove("hide");
    modalWindow.classList.add("hide");
    fetch(`https://jellybellywikiapi.onrender.com/api/Recipes/${id}`)
    .then((res) => res.json())
    .then((data) => {
        recipeModalArr = data;
        directions = data.directions;
        ingredients = data.ingredients;
        isLoad = true;
        if (isLoad) {
            mask.classList.add("hide");
            modalWindow.classList.remove("hide");
            displayRecipeById(ingredients, directions);
        }
      })
    .catch(
        (err) => console.error(`There was an error: ${err}`));
}

const displayRecipeById = (ingredients, directions) => {

    ingredients.forEach((ingredient) => {
        ingredientsContainer.innerHTML += `
        <li class="ingredient">${ingredient}</li>
       `;
    })
    directions.forEach((direction) => {
        directionsContainer.innerHTML += `
        <p class="direction">${direction}</p>`;
    })
}


const displayRecipes = (recipes) => {
    recipes.forEach(({ recipeId, name, description, imageUrl}) => {
        recipeContainer.innerHTML += `
        <div id="${recipeId}" class="user-card">
            <h2 class="dish-name">${name}</h2>
            <img class="user-img" src="${imageUrl}" alt="avatar">
            <p class="bio">${description}</p>
            <button onclick="openModal(${recipeId})" class="btn recipe-button">Check recipe</button>
        </div>
    `;
    });
};       

const fetchMoreRecipes = () => {
    startingIndex += 3;
    endingIndex += 3;
  
    displayRecipes(recipeDataArr.slice(startingIndex, endingIndex));
    if (recipeDataArr.length <= endingIndex) {
        loadMoreBtn.disabled = true;
        loadMoreBtn.style.cursor = "not-allowed";
        loadMoreBtn.textContent = 'No more data to load';
    }
  };


function openModal(id) {
    modal.classList.remove("hide");
    getDataById(id);
    document.body.style.overflow = 'hidden';
    
}

function closeModal(e, clickedOutside) {
    document.body.style.overflow = '';
    if (clickedOutside) {
        if (e.target.classList.contains("modal-overlay"))
            modal.classList.add("hide");
    } else modal.classList.add("hide");
    cleanModal();
}

function cleanModal() {
    const ingredientsArr = document.querySelectorAll('.ingredient');
    const directionArr = document.querySelectorAll('.direction');
    ingredientsArr.forEach(ingredient => {
        ingredient.remove();
    })

    directionArr.forEach(direction => {
        direction.remove();
    })


}



closeBtn.addEventListener("click", closeModal);
loadMoreBtn.addEventListener('click', fetchMoreRecipes);

