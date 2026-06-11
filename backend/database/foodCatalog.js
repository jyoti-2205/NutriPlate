const { getFoodImageUrl } = require('./foodImages');

const SAMPLE_PASSWORD = 'password123';

const sampleFoods = [
  { name: 'Grilled Chicken', price: 249, cholesterol: 75, category: 'Safe', meal_type: 'Non-Veg', tags: 'High Protein,Low Sugar' },
  { name: 'Butter Chicken', price: 329, cholesterol: 120, category: 'Risky', meal_type: 'Non-Veg', tags: 'High Cholesterol,Indian' },
  { name: 'Fresh Garden Salad', price: 179, cholesterol: 10, category: 'Safe', meal_type: 'Veg', tags: 'Low Cholesterol,High Fiber' },
  { name: 'Cheese Pizza', price: 399, cholesterol: 90, category: 'Risky', meal_type: 'Veg', tags: 'Fast Food,High Cholesterol' },
  { name: 'Steamed Fish', price: 349, cholesterol: 60, category: 'Safe', meal_type: 'Non-Veg', tags: 'High Protein,Low Fat' },
  { name: 'Fried Shrimp', price: 429, cholesterol: 110, category: 'Risky', meal_type: 'Non-Veg', tags: 'Seafood,Fried' },
  { name: 'Oatmeal Bowl', price: 149, cholesterol: 5, category: 'Safe', meal_type: 'Veg', tags: 'Breakfast,Low Cholesterol' },
  { name: 'Eggs Benedict', price: 279, cholesterol: 200, category: 'Risky', meal_type: 'Non-Veg', tags: 'Breakfast,High Cholesterol' },
  { name: 'Brown Rice Bowl', price: 199, cholesterol: 8, category: 'Safe', meal_type: 'Veg', tags: 'Low Fat,High Fiber' },
  { name: 'Paneer Tikka', price: 269, cholesterol: 85, category: 'Risky', meal_type: 'Veg', tags: 'Indian,High Protein' },
  { name: 'Dal Khichdi', price: 159, cholesterol: 12, category: 'Safe', meal_type: 'Veg', tags: 'Indian,Low Cholesterol' },
  { name: 'Classic Burger', price: 299, cholesterol: 95, category: 'Risky', meal_type: 'Non-Veg', tags: 'Fast Food,Fried' },
  { name: 'Fruit Smoothie', price: 129, cholesterol: 3, category: 'Safe', meal_type: 'Veg', tags: 'Low Sugar,Breakfast' },
  { name: 'French Fries', price: 99, cholesterol: 15, category: 'Safe', meal_type: 'Veg', tags: 'Fast Food,Low Cholesterol' },
  { name: 'Lamb Curry', price: 449, cholesterol: 130, category: 'Risky', meal_type: 'Non-Veg', tags: 'Indian,High Cholesterol' }
].map((food) => ({
  ...food,
  image: getFoodImageUrl(food.name)
}));

module.exports = { sampleFoods, SAMPLE_PASSWORD };
