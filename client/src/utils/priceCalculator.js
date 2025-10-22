// Utility to calculate recipe price
export const calculateRecipePrice = (formData, coffeeOptions) => {
  let total = 0;

  const toNum = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
  const getById = (id) => {
    const target = toNum(id);
    return coffeeOptions.find((opt) => toNum(opt.id) === target);
  };

  if (formData.caffeine_type_id) {
    const opt = getById(formData.caffeine_type_id);
    if (opt) total += parseFloat(opt.price || 0);
  }

  if (formData.drink_type_id) {
    const opt = getById(formData.drink_type_id);
    if (opt) total += parseFloat(opt.price || 0);
  }

  if (formData.roast_type_id) {
    const opt = getById(formData.roast_type_id);
    if (opt && opt.price) total += parseFloat(opt.price || 0);
  }

  if (formData.milk_option_id) {
    const opt = getById(formData.milk_option_id);
    if (opt) total += parseFloat(opt.price || 0);
  }

  if (formData.shot_number_id) {
    const opt = getById(formData.shot_number_id);
    if (opt) total += parseFloat(opt.price || 0);
  }

  if (formData.shot_modifier_id) {
    const opt = getById(formData.shot_modifier_id);
    if (opt) total += parseFloat(opt.price || 0);
  }

  if (Array.isArray(formData.syrup_option_ids)) {
    formData.syrup_option_ids.forEach((id) => {
      const opt = getById(id);
      if (opt) total += parseFloat(opt.price || 0);
    });
  }

  if (Array.isArray(formData.topping_option_ids)) {
    formData.topping_option_ids.forEach((id) => {
      const opt = getById(id);
      if (opt) total += parseFloat(opt.price || 0);
    });
  }

  const size = (formData.drink_size || '').toString();
  const sizeMultipliers = {
    Small: 1,
    Medium: 1.2,
    Large: 1.4,
    small: 1,
    medium: 1.2,
    large: 1.4,
  };
  total *= sizeMultipliers[size] ?? 1;

  return total;
};
