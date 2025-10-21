import "./dotenv.js";
import { pool } from "./database.js";
import coffeeOptions from "../data/coffeeOptions.js";

// Function to create the coffee_options table
const createCoffeeOptionsTable = async () => {
    const createTableQuery = `
    DROP TABLE IF EXISTS coffee_options CASCADE;

    CREATE TABLE coffee_options (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        price NUMERIC(5, 2) NOT NULL DEFAULT 0.00
    );`;

    try {
        await pool.query(createTableQuery);
        console.log("🎉 Coffee options table created successfully");
    } catch (err) {
        console.error("⚠️ error creating Coffee options table", err);
        throw err;
    }
};

// Function to create the user_recipes table
const createUserRecipesTable = async () => {
    const createTableQuery = `
    DROP TABLE IF EXISTS user_recipes;

    CREATE TABLE user_recipes (
        id BIGSERIAL PRIMARY KEY,
        recipe_name VARCHAR(100) NOT NULL,
        drink_size VARCHAR(20) NOT NULL,
        is_iced BOOLEAN NOT NULL DEFAULT FALSE,

        -- IDs referencing the coffee_options table for consistency
        caffeine_type_id BIGINT REFERENCES coffee_options(id),
        drink_type_id BIGINT REFERENCES coffee_options(id),
        roast_type_id BIGINT REFERENCES coffee_options(id),
        milk_option_id BIGINT REFERENCES coffee_options(id),
        shot_number_id BIGINT REFERENCES coffee_options(id),
        shot_modifier_id BIGINT REFERENCES coffee_options(id), -- For options like 'Decaf'

        -- Arrays of IDs for multi-select options
        syrup_option_ids BIGINT[],
        topping_option_ids BIGINT[],

        total_price NUMERIC(6, 2) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;

    try {
        await pool.query(createTableQuery);
        console.log("🎉 User recipes table created successfully");
    } catch (err) {
        console.error("⚠️ error creating user recipes table", err);
        throw err;
    }
};

// Function to seed the coffee_options table
const seedCoffeeOptionsTable = async () => {
    try {
        for (const option of coffeeOptions) {
            const insertQuery = `
                INSERT INTO coffee_options (name, category, price)
                VALUES ($1, $2, $3);`;
            const values = [option.name, option.category, option.price];

            await pool.query(insertQuery, values);
            console.log(`✅ Inserted coffee option: ${option.name}`);
        }
    } catch (err) {
        console.error("⚠️ error seeding Coffee options table", err);
        throw err;
    }
};

// Main function to run the database reset
const reset = async () => {
    try {
        // We create the coffee_options table first because user_recipes references it.
        await createCoffeeOptionsTable();
        console.log("🎉 Coffee options table created successfully");
        // Then we create the empty user_recipes table.
        await createUserRecipesTable();
        console.log("🎉 User recipes table created successfully");
        // Finally, we seed the coffee_options table with data.
        await seedCoffeeOptionsTable();
        console.log("🎉 Coffee options table seeded successfully!");
        
        pool.end(); // Close the connection pool
    } catch (err) {
        console.error("⚠️ An error occurred during the database reset process", err);
        pool.end(); // Ensure pool is closed on error
    }
};

// Execute the reset function
reset();
