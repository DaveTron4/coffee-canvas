import {pool} from '../config/database.js'

// Get all user recipes
const getAllUserRecipes = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM user_recipes ORDER BY id ASC'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching user recipes:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserRecipeById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query(
            'SELECT * FROM user_recipes WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: `Recipe with id ${id} not found` });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user recipe:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Creates user recipe
const createUserRecipe = async (req, res) => {
    try {
        const {
            recipe_name,
            drink_size,
            is_iced,
            caffeine_type_id,
            drink_type_id,
            roast_type_id,
            milk_option_id,
            shot_number_id,
            shot_modifier_id,
            syrup_option_ids,
            topping_option_ids,
            total_price
        } = req.body;

        const results = await pool.query(
            `
            INSERT INTO user_recipes (
                recipe_name,
                drink_size,
                is_iced,
                caffeine_type_id,
                drink_type_id,
                roast_type_id,
                milk_option_id,
                shot_number_id,
                shot_modifier_id,
                syrup_option_ids,
                topping_option_ids,
                total_price
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
            RETURNING *
        `, [
                recipe_name,
                drink_size,
                is_iced,
                caffeine_type_id,
                drink_type_id,
                roast_type_id,
                milk_option_id,
                shot_number_id,
                shot_modifier_id,
                syrup_option_ids,
                topping_option_ids,
                total_price
            ]
        );

        res.status(201).json(results.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// Update user recipe by ID
const updateUserRecipe = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { recipe_name, drink_size, is_iced, caffeine_type_id, drink_type_id, roast_type_id, milk_option_id, shot_number_id, shot_modifier_id, syrup_option_ids, topping_option_ids, total_price } = req.body;

        const result = await pool.query(
            `
            UPDATE user_recipes SET
            recipe_name = $1,
            drink_size = $2,
            is_iced = $3,
            caffeine_type_id = $4,
            drink_type_id = $5,
            roast_type_id = $6,
            milk_option_id = $7,
            shot_number_id = $8,
            shot_modifier_id = $9,
            syrup_option_ids = $10,
            topping_option_ids = $11,
            total_price = $12
            WHERE id = $13
            RETURNING *
            `,
            [
                recipe_name,
                drink_size,
                is_iced,
                caffeine_type_id,
                drink_type_id,
                roast_type_id,
                milk_option_id,
                shot_number_id,
                shot_modifier_id,
                syrup_option_ids,
                topping_option_ids,
                total_price,
                id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `Recipe with id ${id} not found` });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
}

// Delete user recipe by ID
const deleteUserRecipe = async (req, res) => {
    try {
    const id = parseInt(req.params.id);

    const results = await pool.query(
      `
      DELETE FROM user_recipes WHERE id = $1`,
      [id]
    );

    res.status(200).json(results.rows[0]);
  } catch (error) {
    res.status(409).json({ error: error.message });
  }
};

export default { getAllUserRecipes, getUserRecipeById, updateUserRecipe, createUserRecipe, deleteUserRecipe };