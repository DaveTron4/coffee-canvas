/**
 * Helper utilities to resolve recipe IDs to their display names
 */

/**
 * Find an option by ID in a flat array of options
 */
const findOptionById = (options, id) => {
  if (!options || !Array.isArray(options)) return null;
  const numId = Number(id);
  return options.find(opt => Number(opt.id) === numId);
};

/**
 * Get the name of a single option by ID
 * @param {Array} options - Flat array of all coffee options
 * @param {number|string} id - The ID to look up
 * @returns {string} - The option name or 'Unknown'
 */
export const getOptionName = (options, id) => {
  if (!id) return 'None';
  const option = findOptionById(options, id);
  return option ? option.name : 'Unknown';
};

/**
 * Get names for multiple option IDs (e.g., syrups, toppings)
 * @param {Array} options - Flat array of all coffee options
 * @param {Array} ids - Array of IDs to look up
 * @returns {string} - Comma-separated names or 'None'
 */
export const getMultipleOptionNames = (options, ids) => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) return 'None';
  
  const names = ids
    .map(id => {
      const option = findOptionById(options, id);
      return option ? option.name : null;
    })
    .filter(Boolean);
  
  return names.length > 0 ? names.join(', ') : 'None';
};

/**
 * Enrich a recipe object with resolved option names
 * @param {Object} recipe - Recipe with ID fields
 * @param {Array} allOptions - Flat array of all coffee options
 * @returns {Object} - Recipe enriched with _display fields
 */
export const enrichRecipeWithNames = (recipe, allOptions) => {
  return {
    ...recipe,
    _display: {
      caffeine_type: getOptionName(allOptions, recipe.caffeine_type_id),
      drink_type: getOptionName(allOptions, recipe.drink_type_id),
      roast_type: getOptionName(allOptions, recipe.roast_type_id),
      milk_option: getOptionName(allOptions, recipe.milk_option_id),
      shot_number: getOptionName(allOptions, recipe.shot_number_id),
      shot_modifier: getOptionName(allOptions, recipe.shot_modifier_id),
      syrups: getMultipleOptionNames(allOptions, recipe.syrup_option_ids),
      toppings: getMultipleOptionNames(allOptions, recipe.topping_option_ids),
    }
  };
};
