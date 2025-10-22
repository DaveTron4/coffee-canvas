import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import UserRecipesAPI from '../services/UserRecipesAPI'
import { calculateRecipePrice } from '../utils/priceCalculator'
import '../css/CreateCoffee.css'

const EditCoffee = ({ coffeeOptions }) => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)

    // State to hold coffee recipe details
    const [coffeeRecipe, setCoffeeRecipe] = useState({
        recipe_name: '',
        drink_size: '',
        is_iced: false,

        caffeine_type_id: '',
        drink_type_id: '',
        roast_type_id: '',
        milk_option_id: '',
        shot_number_id: '',
        shot_modifier_id: '',

        syrup_option_ids: [],
        topping_option_ids: [],

        total_price: 0.0,
    })

    // Load existing recipe data
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await UserRecipesAPI.getUserRecipeById(id)
                
                // Ensure arrays are properly formatted
                setCoffeeRecipe({
                    recipe_name: data.recipe_name || '',
                    drink_size: data.drink_size || '',
                    is_iced: data.is_iced || false,
                    caffeine_type_id: data.caffeine_type_id || '',
                    drink_type_id: data.drink_type_id || '',
                    roast_type_id: data.roast_type_id || '',
                    milk_option_id: data.milk_option_id || '',
                    shot_number_id: data.shot_number_id || '',
                    shot_modifier_id: data.shot_modifier_id || '',
                    syrup_option_ids: Array.isArray(data.syrup_option_ids) ? data.syrup_option_ids : [],
                    topping_option_ids: Array.isArray(data.topping_option_ids) ? data.topping_option_ids : [],
                    total_price: data.total_price || 0.0,
                })
                setLoading(false)
            } catch (error) {
                console.error('Error fetching recipe:', error)
                alert('Failed to load recipe')
                navigate('/coffees')
            }
        }

        fetchRecipe()
    }, [id, navigate])

    const handleChange = (event) => {
        const { name, value } = event.target

        setCoffeeRecipe((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    // Toggle for multi-select arrays (syrups, toppings)
    const handleToggle = (field, id) => {
        const numericId = parseInt(id)
        setCoffeeRecipe((prev) => {
            const arr = Array.isArray(prev[field]) ? prev[field] : []
            const exists = arr.includes(numericId)
            const next = exists ? arr.filter((x) => x !== numericId) : [...arr, numericId]
            return { ...prev, [field]: next }
        })
    }

    // Build a flat array of all options for price calculation
    const allOptions = useMemo(() => {
        return [
            ...coffeeOptions.caffeineTypes,
            ...coffeeOptions.drinkTypes,
            ...coffeeOptions.roastTypes,
            ...coffeeOptions.milkOptions,
            ...coffeeOptions.shotNumbers,
            ...coffeeOptions.shotModifiers,
            ...coffeeOptions.syrupOptions,
            ...coffeeOptions.toppingOptions,
        ]
    }, [coffeeOptions])

    // Determine feature availability based on selected caffeine type
    const selectedCaffeine = useMemo(() => {
        const id = parseInt(coffeeRecipe.caffeine_type_id)
        if (!id) return null
        return coffeeOptions.caffeineTypes.find((c) => Number(c.id) === id) || null
    }, [coffeeRecipe.caffeine_type_id, coffeeOptions.caffeineTypes])

    const allowsShots = useMemo(() => {
        if (!selectedCaffeine) return false
        const name = (selectedCaffeine.name || '').toLowerCase()
        return name.includes('espresso')
    }, [selectedCaffeine])

    const allowsRoast = useMemo(() => {
        if (!selectedCaffeine) return false
        const name = (selectedCaffeine.name || '').toLowerCase()
        return name.includes('brew')
    }, [selectedCaffeine])

    // When caffeine type changes, reset disallowed fields
    useEffect(() => {
        if (loading) return
        setCoffeeRecipe((prev) => {
            let updated = { ...prev }
            let changed = false
            if (!allowsShots) {
                if (prev.shot_number_id) { updated.shot_number_id = ''; changed = true }
                if (prev.shot_modifier_id) { updated.shot_modifier_id = ''; changed = true }
            }
            if (!allowsRoast) {
                if (prev.roast_type_id) { updated.roast_type_id = ''; changed = true }
            }
            return changed ? updated : prev
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowsShots, allowsRoast])

    // Recalculate and store total price whenever selections change
    useEffect(() => {
        if (allOptions.length > 0 && !loading) {
            const price = calculateRecipePrice(coffeeRecipe, allOptions)
            setCoffeeRecipe((prev) => ({ ...prev, total_price: parseFloat(price.toFixed(2)) }))
        }
    }, [
        coffeeRecipe.drink_size,
        coffeeRecipe.is_iced,
        coffeeRecipe.caffeine_type_id,
        coffeeRecipe.drink_type_id,
        coffeeRecipe.roast_type_id,
        coffeeRecipe.milk_option_id,
        coffeeRecipe.shot_number_id,
        coffeeRecipe.shot_modifier_id,
        JSON.stringify(coffeeRecipe.syrup_option_ids),
        JSON.stringify(coffeeRecipe.topping_option_ids),
        allOptions,
        loading,
    ])

    const updateCoffee = async (event) => {
        event.preventDefault()
        try {
            // Ensure numeric ids where appropriate
            const payload = {
                ...coffeeRecipe,
                caffeine_type_id: coffeeRecipe.caffeine_type_id ? parseInt(coffeeRecipe.caffeine_type_id) : null,
                drink_type_id: coffeeRecipe.drink_type_id ? parseInt(coffeeRecipe.drink_type_id) : null,
                roast_type_id: coffeeRecipe.roast_type_id ? parseInt(coffeeRecipe.roast_type_id) : null,
                milk_option_id: coffeeRecipe.milk_option_id ? parseInt(coffeeRecipe.milk_option_id) : null,
                shot_number_id: coffeeRecipe.shot_number_id ? parseInt(coffeeRecipe.shot_number_id) : null,
                shot_modifier_id: coffeeRecipe.shot_modifier_id ? parseInt(coffeeRecipe.shot_modifier_id) : null,
            }

            await UserRecipesAPI.updateUserRecipe(id, payload)
            // Redirect to the detail page after successful update
            navigate(`/coffees/${id}`)
        } catch (error) {
            console.error('Coffee update failed', error)
            alert('Failed to update recipe')
        }
    }

    if (loading) {
        return (
            <div className="create-coffee-container">
                <p>Loading recipe...</p>
            </div>
        )
    }

    return (
        <div className={`create-coffee-container ${coffeeRecipe.is_iced ? 'iced-theme' : 'hot-theme'}`}>
            <div className="theme-indicator">
                {coffeeRecipe.is_iced ? '❄️' : '🔥'}
            </div>
            <h2>Edit Coffee Recipe</h2>
            <form onSubmit={updateCoffee} className="create-coffee-form">
                <label>
                    Recipe Name
                    <input
                        type="text"
                        name="recipe_name"
                        value={coffeeRecipe.recipe_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Drink Size
                    <select
                        name="drink_size"
                        value={coffeeRecipe.drink_size}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Size</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                    </select>
                </label>
                <label>
                    Is Iced
                    <input
                        type="checkbox"
                        name="is_iced"
                        checked={coffeeRecipe.is_iced}
                        onChange={(e) => setCoffeeRecipe({ ...coffeeRecipe, is_iced: e.target.checked })}
                    />
                </label>
                <label>
                    Caffeine Type
                    <select
                        name="caffeine_type_id"
                        value={coffeeRecipe.caffeine_type_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Caffeine Type</option>
                        {coffeeOptions.caffeineTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name} - {type.price ? `$${type.price}` : 'Free'}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Drink Type
                    <select
                        name="drink_type_id"
                        value={coffeeRecipe.drink_type_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Drink Type</option>
                        {coffeeOptions.drinkTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name} - ${type.price ? `${type.price}` : 'Free'}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Roast Type
                    <select
                        name="roast_type_id"
                        value={coffeeRecipe.roast_type_id}
                        onChange={handleChange}
                        disabled={!allowsRoast}
                        required
                    >
                        <option value="">Select Roast Type</option>
                        {coffeeOptions.roastTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name} - ${type.price ? `${type.price}` : 'Free'}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Milk Option
                    <select
                        name="milk_option_id"
                        value={coffeeRecipe.milk_option_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Milk Option</option>
                        {coffeeOptions.milkOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name} - ${option.price ? `${option.price}` : 'Free'}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Shot Number
                    <select
                        name="shot_number_id"
                        value={coffeeRecipe.shot_number_id}
                        onChange={handleChange}
                        disabled={!allowsShots}
                        required
                    >
                        <option value="">Select Shot Number</option>
                        {coffeeOptions.shotNumbers.map((number) => (
                            <option key={number.id} value={number.id}>
                                {number.name} - ${number.price ? `${number.price}` : 'Free'}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Shot Modifier
                    <select
                        name="shot_modifier_id"
                        value={coffeeRecipe.shot_modifier_id}
                        onChange={handleChange}
                        disabled={!allowsShots}
                    >
                        <option value="">Select Shot Modifier</option>
                        {coffeeOptions.shotModifiers.map((modifier) => (
                            <option key={modifier.id} value={modifier.id}>
                                {modifier.name} - ${modifier.price ? `${modifier.price}` : 'Free'}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="form-group">
                    <label>
                        Syrup Options
                        {coffeeRecipe.syrup_option_ids.length > 0 && (
                            <span className="selection-count"> ({coffeeRecipe.syrup_option_ids.length} selected)</span>
                        )}
                    </label>
                    <div className="checkbox-list">
                        {coffeeOptions.syrupOptions.map((option) => (
                            <label key={option.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={option.id}
                                    checked={coffeeRecipe.syrup_option_ids.includes(option.id)}
                                    onChange={() => handleToggle('syrup_option_ids', option.id)}
                                />
                                {option.name} - ${option.price ? `${option.price}` : 'Free'}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label>
                        Topping Options
                        {coffeeRecipe.topping_option_ids.length > 0 && (
                            <span className="selection-count"> ({coffeeRecipe.topping_option_ids.length} selected)</span>
                        )}
                    </label>
                    <div className="checkbox-list">
                        {coffeeOptions.toppingOptions.map((option) => (
                            <label key={option.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    value={option.id}
                                    checked={coffeeRecipe.topping_option_ids.includes(option.id)}
                                    onChange={() => handleToggle('topping_option_ids', option.id)}
                                />
                                {option.name} - ${option.price ? `${option.price}` : 'Free'}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Total Price */}
                <div className="total-price">
                    <h3>Total Price: ${Number(coffeeRecipe.total_price || 0).toFixed(2)}</h3>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">Update Coffee Recipe</button>
                    <button 
                        type="button" 
                        className="cancel-button" 
                        onClick={() => navigate(`/coffees/${id}`)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditCoffee