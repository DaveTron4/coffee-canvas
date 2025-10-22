import React from 'react'
import { useState, useEffect, useMemo } from 'react'
import '../App.css'
import UserRecipesAPI from '../services/UserRecipesAPI'
import CoffeeOptionsAPI from '../services/CoffeeOptionsAPI'
import { enrichRecipeWithNames } from '../utils/recipeHelpers'
import { Link } from 'react-router-dom'

const ViewCoffee = () => {
    const [coffeeRecipes, setCoffeeRecipes] = useState([])
    const [coffeeOptions, setCoffeeOptions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipes, options] = await Promise.all([
                    UserRecipesAPI.getUserRecipes(),
                    CoffeeOptionsAPI.getCoffeeOptions(),
                ])
                setCoffeeRecipes(Array.isArray(recipes) ? recipes : [])
                setCoffeeOptions(Array.isArray(options) ? options : [])
            } catch (e) {
                console.error('Error loading recipes/options:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Enrich recipes with display names when options are available
    const enrichedRecipes = useMemo(() => {
        if (!coffeeRecipes?.length || !coffeeOptions?.length) return []
        return coffeeRecipes.map((recipe) => enrichRecipeWithNames(recipe, coffeeOptions))
    }, [coffeeRecipes, coffeeOptions])

    if (loading) {
        return (
            <div className="view-coffee-page">
                <h2>Coffee Recipes</h2>
                <p>Loading recipes...</p>
            </div>
        )
    }

    if (!coffeeRecipes.length) {
        return (
            <div className="view-coffee-page">
                <h2>Coffee Recipes</h2>
                <p>No recipes yet. Create one to get started.</p>
            </div>
        )
    }

    const hasOptions = coffeeOptions?.length > 0

    return (
        <div className="view-coffee-page">
            <h2>Coffee Recipes</h2>
            <div className="recipes-list">
                {(hasOptions ? enrichedRecipes : coffeeRecipes).map((recipe) => (
                    <Link to={`/coffees/${recipe.id}`} key={recipe.id} className="recipe-card-link">
                        <div className="recipe-card">
                            <h3>{recipe.is_iced ? '❄️' : ' 🔥'} {recipe.recipe_name}</h3>

                            <div className="recipe-details">
                                <p><strong>Size:</strong> {recipe.drink_size}</p>
                                <p><strong>Iced:</strong> {recipe.is_iced ? 'Yes' : 'No'}</p>

                                {hasOptions ? (
                                    <>
                                        <p><strong>Caffeine Type:</strong> {recipe._display.caffeine_type}</p>
                                        <p><strong>Drink Type:</strong> {recipe._display.drink_type}</p>
                                        <p><strong>Roast Type:</strong> {recipe._display.roast_type}</p>
                                        <p><strong>Milk:</strong> {recipe._display.milk_option}</p>

                                        <p><strong>Shots:</strong> {recipe._display.shot_number}</p>
                                        {recipe._display.shot_modifier !== 'None' && (
                                            <p><strong>Shot Modifier:</strong> {recipe._display.shot_modifier}</p>
                                        )}

                                        <p><strong>Syrups:</strong> {recipe._display.syrups}</p>
                                        <p><strong>Toppings:</strong> {recipe._display.toppings}</p>
                                    </>
                                ) : (
                                    <>
                                        <p><strong>Caffeine Type ID:</strong> {recipe.caffeine_type_id}</p>
                                        <p><strong>Drink Type ID:</strong> {recipe.drink_type_id}</p>
                                        <p><strong>Roast Type ID:</strong> {recipe.roast_type_id}</p>
                                        <p><strong>Milk ID:</strong> {recipe.milk_option_id}</p>
                                        <p><strong>Shots ID:</strong> {recipe.shot_number_id}</p>
                                        {recipe.shot_modifier_id && (
                                            <p><strong>Shot Modifier ID:</strong> {recipe.shot_modifier_id}</p>
                                        )}
                                        {Array.isArray(recipe.syrup_option_ids) && (
                                            <p><strong>Syrup IDs:</strong> {recipe.syrup_option_ids.join(', ')}</p>
                                        )}
                                        {Array.isArray(recipe.topping_option_ids) && (
                                            <p><strong>Topping IDs:</strong> {recipe.topping_option_ids.join(', ')}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ViewCoffee