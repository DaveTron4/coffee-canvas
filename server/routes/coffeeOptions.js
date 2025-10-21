import express from 'express'
// import controller for custom items
import coffeeOptionsController from '../controllers/coffeeOptions.js'

const router = express.Router()

// define routes to get, create, edit, and delete items
router.get('/', coffeeOptionsController.getAllCoffeeOptions)

export default router