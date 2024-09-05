// Sample Recipe Data
const defaultRecipes = [
    {
        id: 1,
        title: "Pancakes",
        category: "breakfast",
        image: "images/pancakes.jpg",
        description: "Fluffy and delicious pancakes for your perfect breakfast.",
        procedure: "Sift flour, baking powder, sugar, and salt together in a large bowl. Make a well in the center and add milk, melted butter, and egg; mix until smooth. Heat a lightly oiled griddle or pan over medium-high heat. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake; cook until bubbles form and the edges are dry, about 2 to 3 minutes. Flip and cook until browned on the other side. Repeat with remaining batter."
    },
    {
        id: 2,
        title: "Caesar Salad",
        category: "lunch",
        image: "images/salad.jpg",
        description: "A fresh Caesar salad with a homemade dressing.",
        procedure: "Toss lettuce with Caesar dressing and croutons."
    },
    {
        id: 3,
        title: "Spaghetti Bolognese",
        category: "dinner",
        image: "images/spaghetti.jpg",
        description: "A classic Italian dish with rich, meaty sauce.",
        procedure: "Cook spaghetti and mix with Bolognese sauce."
    },
    {
        id: 4,
        title: "Brownies",
        category: "desserts",
        image: "images/brownies.jpg",
        description: "Delicious chocolate brownies with a crispy top.",
        procedure: "Mix ingredients and bake until firm."
    },
    {
        id: 5,
        title: "Bruschetta",
        category: "appetizers",
        image: "images/bruschetta.jpg",
        description: "Crispy bread topped with fresh tomatoes and basil.",
        procedure: "Top toasted bread with a mix of tomatoes and basil."
    }
];

// Function to load recipes from local storage or use default
function loadRecipesFromStorage() {
    const storedRecipes = localStorage.getItem('recipes');
    return storedRecipes ? JSON.parse(storedRecipes) : defaultRecipes;
}

// Function to save recipes to local storage
function saveRecipesToStorage(recipes) {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Load recipes
let recipes = loadRecipesFromStorage();

// Function to display recipes
function displayRecipes(recipeArray) {
    const recipeList = document.getElementById('recipe-list');
    if (recipeList) {
        recipeList.innerHTML = '';
        recipeArray.forEach(recipe => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            recipeDiv.innerHTML = `
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
                <button class="edit-button" data-id="${recipe.id}">Edit</button>
                <button class="delete-button" data-id="${recipe.id}">Delete</button>
            `;
            recipeDiv.addEventListener('click', () => {
                showRecipeDetails(recipe);
            });
            recipeList.appendChild(recipeDiv);
        });
        addEventListeners(); // Add event listeners after displaying recipes
    } else {
        console.warn('Recipe list element not found.');
    }
}

// Function to show recipe details in a modal
function showRecipeDetails(recipe) {
    const recipeModal = document.getElementById('recipe-modal');
    if (recipeModal) {
        document.getElementById('modal-title').textContent = recipe.title;
        document.getElementById('modal-image').src = recipe.image;
        document.getElementById('modal-description').textContent = recipe.description;
        document.getElementById('modal-procedure').textContent = recipe.procedure || 'No procedure available.';
        recipeModal.style.display = 'block'; // Show the modal
    } else {
        console.warn('Recipe modal element not found.');
    }
}

// Function to handle search functionality
function handleSearch() {
    const searchBar = document.getElementById('search-bar');
    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchText = e.target.value.toLowerCase();
            const filteredRecipes = recipes.filter(recipe => 
                recipe.title.toLowerCase().includes(searchText) ||
                recipe.category.toLowerCase().includes(searchText)
            );
            displayRecipes(filteredRecipes);
        });
    } else {
        console.warn('Search bar element not found.');
    }
}

// Function to handle cancel button in the modal
function handleCancelButton() {
    const cancelButton = document.getElementById('cancel-button');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            const recipeModal = document.getElementById('recipe-modal');
            if (recipeModal) {
                recipeModal.style.display = 'none'; // Hide the modal
            }
        });
    } else {
        console.warn('Cancel button element not found.');
    }
}

// Function to handle add, edit, and delete actions
function addEventListeners() {
    // Handle Edit Button Click
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.dataset.id;
            const recipe = recipes.find(r => r.id === parseInt(recipeId));
            if (recipe) {
                document.getElementById('edit-title').value = recipe.title;
                document.getElementById('edit-category').value = recipe.category;
                document.getElementById('edit-image').value = recipe.image;
                document.getElementById('edit-description').value = recipe.description;
                document.getElementById('edit-procedure').value = recipe.procedure || '';
                document.getElementById('edit-recipe-form').style.display = 'block';
                document.getElementById('update-button').dataset.id = recipe.id; // Set ID for update
            }
            e.stopPropagation();
        });
    });

    // Handle Delete Button Click
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeId = e.target.dataset.id;
            const recipe = recipes.find(r => r.id === parseInt(recipeId));
            if (recipe) {
                if (confirm(`Are you sure you want to delete the recipe "${recipe.title}"?`)) {
                    deleteRecipe(recipeId);
                }
            }
            e.stopPropagation();
        });
    });
}

// Function to delete a recipe
function deleteRecipe(recipeId) {
    const index = recipes.findIndex(r => r.id === parseInt(recipeId));
    if (index !== -1) {
        recipes.splice(index, 1);
        saveRecipesToStorage(recipes); // Save updated recipes to storage
        displayRecipes(recipes);
    }
}

// Function to add a recipe
function addRecipe() {
    const title = document.getElementById('add-title').value;
    const category = document.getElementById('add-category').value;
    const image = document.getElementById('add-image').value;
    const description = document.getElementById('add-description').value;
    const procedure = document.getElementById('add-procedure').value;

    const newRecipe = {
        id: recipes.length ? recipes[recipes.length - 1].id + 1 : 1,
        title,
        category,
        image,
        description,
        procedure
    };

    recipes.push(newRecipe);
    saveRecipesToStorage(recipes); // Save updated recipes to storage
    displayRecipes(recipes);

    // Clear the form fields
    const addForm = document.getElementById('add-recipe-form');
    if (addForm) {
        addForm.reset(); // Only resets the add recipe form
    } else {
        console.warn('Add recipe form element not found.');
    }
     // Only resets the add recipe form
}

// Function to update a recipe
function updateRecipe(recipeId) {
    const title = document.getElementById('edit-title').value;
    const category = document.getElementById('edit-category').value;
    const image = document.getElementById('edit-image').value;
    const description = document.getElementById('edit-description').value;
    const procedure = document.getElementById('edit-procedure').value;

    const recipe = recipes.find(r => r.id === parseInt(recipeId));
    if (recipe) {
        recipe.title = title;
        recipe.category = category;
        recipe.image = image;
        recipe.description = description;
        recipe.procedure = procedure;
        saveRecipesToStorage(recipes); // Save updated recipes to storage
        displayRecipes(recipes);
        document.getElementById('edit-recipe-form').style.display = 'none'; // Hide form
    }
}

// Function to load recipes based on the page
function loadRecipes() {
    const currentPage = window.location.pathname.split('/').pop();
    switch (currentPage) {
        case 'breakfast.html':
            displayRecipes(recipes.filter(recipe => recipe.category === 'breakfast'));
            break;
        case 'lunch.html':
            displayRecipes(recipes.filter(recipe => recipe.category === 'lunch'));
            break;
        case 'dinner.html':
            displayRecipes(recipes.filter(recipe => recipe.category === 'dinner'));
            break;
        case 'desserts.html':
            displayRecipes(recipes.filter(recipe => recipe.category === 'desserts'));
            break;
        case 'appetizers.html':
            displayRecipes(recipes.filter(recipe => recipe.category === 'appetizers'));
            break;
        default:
            displayRecipes(recipes); // Show all recipes on the homepage
            break;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    handleSearch();
    handleCancelButton();
    loadRecipes();

    // Handle Add Recipe
    document.getElementById('add-button').addEventListener('click', addRecipe);

    // Handle Update Recipe
    document.getElementById('update-button').addEventListener('click', () => {
        const recipeId = document.getElementById('update-button').dataset.id;
        updateRecipe(recipeId);
    });
});
