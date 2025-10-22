// Gets flat coffee options from the server (array of { id, name, category, price })
const getCoffeeOptions = async () => {
    try {
        const response = await fetch('/api/coffee-options');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching coffee options:', error);
        throw error;
    }
};

// Returns categorized coffee options to match component expectations
// Shape: { caffeineTypes, drinkTypes, roastTypes, milkOptions, shotNumbers, shotModifiers, syrupOptions, toppingOptions }
const getAllCoffeeOptions = async () => {
    const data = await getCoffeeOptions();
    const categorized = {
        caffeineTypes: [],
        drinkTypes: [],
        roastTypes: [],
        milkOptions: [],
        shotNumbers: [],
        shotModifiers: [],
        syrupOptions: [],
        toppingOptions: [],
    };

    if (Array.isArray(data)) {
        data.forEach((opt) => {
            switch (opt.category) {
                case 'Caffeine Type':
                    categorized.caffeineTypes.push(opt);
                    break;
                case 'Drink Type':
                    categorized.drinkTypes.push(opt);
                    break;
                case 'Roast Type':
                    categorized.roastTypes.push(opt);
                    break;
                case 'Milk':
                    categorized.milkOptions.push(opt);
                    break;
                case 'Shot Number':
                    categorized.shotNumbers.push(opt);
                    break;
                case 'Shot Modifier':
                    categorized.shotModifiers.push(opt);
                    break;
                case 'Syrup':
                    categorized.syrupOptions.push(opt);
                    break;
                case 'Topping':
                    categorized.toppingOptions.push(opt);
                    break;
                default:
                    break;
            }
        });
    }

    return categorized;
};

export default { getCoffeeOptions, getAllCoffeeOptions };