// Get user recipes from the server
const getUserRecipes = async () => {
    try {
        const response = await fetch('/api/user-recipes');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user recipes:', error);
        throw error;
    }
};

// Get user recipe by ID from the server
const getUserRecipeById = async (id) => {
    try {
        const response = await fetch(`/api/user-recipes/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user recipe:', error);
        throw error;
    }
};

// Create user recipe on the server
const createUserRecipe = async (recipe) => {
    try {
        const response = await fetch('/api/user-recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating user recipe:', error);
        throw error;
    }
};

// Update user recipe on the server
const updateUserRecipe = async (id, updatedRecipe) => {
    try {
        const response = await fetch(`/api/user-recipes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRecipe),
        });
        await response.json();
    } catch (error) {
        console.error('Error updating user recipe:', error);
        throw error;
    }
};

// Delete user recipe from the server
const deleteUserRecipe = async (id) => {
    try {
        const response = await fetch(`/api/user-recipes/${id}`, {
            method: 'DELETE',
        });

    } catch (error) {
        console.error('Error deleting user recipe:', error);
        throw error;
    }
};

export default { getUserRecipes, getUserRecipeById, createUserRecipe, updateUserRecipe, deleteUserRecipe };
