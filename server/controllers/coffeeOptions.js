import {pool} from '../config/database.js'

const getAllCoffeeOptions = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM coffee_options ORDER BY id ASC'
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching coffee options:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default { getAllCoffeeOptions };