const { getFoodImageUrl } = require('../database/foodImages');

function normalizeFoodImage(food) {
  if (!food) return food;
  return { ...food, image: getFoodImageUrl(food.name) };
}

function normalizeFoodList(foods) {
  return foods.map(normalizeFoodImage);
}

function normalizeOrderRow(order) {
  if (!order) return order;
  return { ...order, image: getFoodImageUrl(order.food_name) };
}

function normalizeOrderList(orders) {
  return orders.map(normalizeOrderRow);
}

module.exports = { normalizeFoodImage, normalizeFoodList, normalizeOrderRow, normalizeOrderList };
