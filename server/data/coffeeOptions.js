/**
 * @file This file contains the master list of all coffee customization options.
 * This data is intended to be used to "seed" the coffee_options table in the database.
 * Each object represents a single row in the table.
 */

const coffeeOptions = [
  // --- Caffeine Type Options ---
  // These represent the base of the drink and have a base price.
  { name: 'Espresso', category: 'Caffeine Type', price: 2.50 },
  { name: 'Cold Brew', category: 'Caffeine Type', price: 3.00 },
  { name: 'Brewed Coffee', category: 'Caffeine Type', price: 2.00 },

  // --- Drink Type Options ---
  // These are styles, which may or may not add to the cost.
  { name: 'Latte', category: 'Drink Type', price: 0.00 },
  { name: 'Cappuccino', category: 'Drink Type', price: 0.00 },
  { name: 'Americano', category: 'Drink Type', price: 0.00 },
  { name: 'Mocha', category: 'Drink Type', price: 0.50 }, // Mocha has an upcharge for chocolate

  // --- Roast Type Options ---
  { name: 'Light Roast', category: 'Roast Type', price: 0.00 },
  { name: 'Medium Roast', category: 'Roast Type', price: 0.00 },
  { name: 'Dark Roast', category: 'Roast Type', price: 0.00 },

  // --- Milk Options ---
  // Prices here are add-ons.
  { name: 'Whole Milk', category: 'Milk', price: 0.00 },
  { name: 'Skim Milk', category: 'Milk', price: 0.00 },
  { name: 'Oat Milk', category: 'Milk', price: 0.75 },
  { name: 'Almond Milk', category: 'Milk', price: 0.75 },
  { name: 'Soy Milk', category: 'Milk', price: 0.50 },

  // --- Syrup Flavors ---
  // Prices are add-ons.
  { name: 'Vanilla Syrup', category: 'Syrup', price: 0.50 },
  { name: 'Caramel Syrup', category: 'Syrup', price: 0.50 },
  { name: 'Hazelnut Syrup', category: 'Syrup', price: 0.50 },
  { name: 'Mocha Sauce', category: 'Syrup', price: 0.60 },
  { name: 'Sugar-Free Vanilla', category: 'Syrup', price: 0.50 },
  { name: 'Pumpkin Spice', category: 'Syrup', price: 0.75 },

  // --- Toppings ---
  // Prices are add-ons.
  { name: 'Whipped Cream', category: 'Topping', price: 0.50 },
  { name: 'Caramel Drizzle', category: 'Topping', price: 0.60 },
  { name: 'Chocolate Shavings', category: 'Topping', price: 0.40 },
  { name: 'Cinnamon Powder', category: 'Topping', price: 0.25 },

  // --- Shot Options ---
  // Prices add to the base 'Caffeine Type' price.
  { name: 'Single Shot', category: 'Shot Number', price: 0.00 }, // Included in base
  { name: 'Double Shot', category: 'Shot Number', price: 1.00 },
  { name: 'Triple Shot', category: 'Shot Number', price: 2.00 },
  { name: 'Decaf', category: 'Shot Modifier', price: 0.25 },
];

export default coffeeOptions;
