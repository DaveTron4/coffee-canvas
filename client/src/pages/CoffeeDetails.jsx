import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UserRecipesAPI from '../services/UserRecipesAPI'
import CoffeeOptionsAPI from '../services/CoffeeOptionsAPI'
import { enrichRecipeWithNames } from '../utils/recipeHelpers'
import '../App.css'

const CoffeeDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState(null)
    const [coffeeOptions, setCoffeeOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [recipeData, options] = await Promise.all([
                    UserRecipesAPI.getUserRecipeById(id),
                    CoffeeOptionsAPI.getCoffeeOptions(),
                ])
                
                // Enrich recipe with display names
                const enrichedRecipe = enrichRecipeWithNames(recipeData, options)
                setRecipe(enrichedRecipe)
                setCoffeeOptions(options)
            } catch (e) {
                console.error('Error loading recipe details:', e)
                setError('Failed to load recipe details')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleDelete = async () => {
        try {
            await UserRecipesAPI.deleteUserRecipe(id)
            navigate('/coffees')
        } catch (e) {
            console.error('Error deleting recipe:', e)
            alert('Failed to delete recipe')
        }
    }

    const handleEdit = () => {
        navigate(`/edit/${id}`)
    }

    if (loading) {
        return (
            <div className="coffee-details-page">
                <p>Loading recipe...</p>
            </div>
        )
    }

    if (error || !recipe) {
        return (
            <div className="coffee-details-page">
                <p>{error || 'Recipe not found'}</p>
                <button onClick={() => navigate('/coffees')}>Back to Recipes</button>
            </div>
        )
    }

    return (
        <div className="coffee-details-page">
            <div className="details-header">
                <h2>{recipe.is_iced ? '❄️' : '🔥'} {recipe.recipe_name}</h2>
                <div className="action-buttons">
                    <button className="edit-button" onClick={handleEdit}>
                        Edit Recipe
                    </button>
                    <button className="delete-button" onClick={handleDelete}>
                        Delete Recipe
                    </button>
                </div>
            </div>

            <div className="recipe-details-full">
                <div className="detail-section">
                    <h3>Basic Information</h3>
                    <div className="detail-row">
                        <span className="detail-label">Size:</span>
                        <span className="detail-value">{recipe.drink_size}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Temperature:</span>
                        <span className="detail-value">{recipe.is_iced ? 'Iced ❄️' : 'Hot 🔥'}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Coffee Base</h3>
                    <div className="detail-row">
                        <span className="detail-label">Caffeine Type:</span>
                        <span className="detail-value">{recipe._display.caffeine_type}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Drink Type:</span>
                        <span className="detail-value">{recipe._display.drink_type}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Roast Type:</span>
                        <span className="detail-value">{recipe._display.roast_type}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Milk:</span>
                        <span className="detail-value">{recipe._display.milk_option}</span>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Espresso Shots</h3>
                    <div className="detail-row">
                        <span className="detail-label">Number of Shots:</span>
                        <span className="detail-value">{recipe._display.shot_number}</span>
                    </div>
                    {recipe._display.shot_modifier !== 'None' && (
                        <div className="detail-row">
                            <span className="detail-label">Shot Modifier:</span>
                            <span className="detail-value">{recipe._display.shot_modifier}</span>
                        </div>
                    )}
                </div>

                <div className="detail-section">
                    <h3>Customizations</h3>
                    <div className="detail-row">
                        <span className="detail-label">Syrups:</span>
                        <span className="detail-value">{recipe._display.syrups}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Toppings:</span>
                        <span className="detail-value">{recipe._display.toppings}</span>
                    </div>
                </div>

                <div className="detail-section total-section">
                    <h3>Total Price</h3>
                    <div className="detail-row">
                        <span className="price-large">${Number(recipe.total_price || 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="back-button-container">
                <button className="back-button" onClick={() => navigate('/coffees')}>
                    ← Back to All Recipes
                </button>
            </div>
        </div>
    )
}

export default CoffeeDetails