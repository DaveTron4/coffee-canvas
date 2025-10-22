import express from 'express'
// import controller for custom items
import userRecipesController from '../controllers/userRecipes.js'

const router = express.Router()

// define routes to get, create, edit, and delete items
router.get('/', userRecipesController.getAllUserRecipes)
router.get('/:id', userRecipesController.getUserRecipeById)
router.post('/', userRecipesController.createUserRecipe)
router.put('/:id', userRecipesController.updateUserRecipe)
router.delete('/:id', userRecipesController.deleteUserRecipe)

export default router