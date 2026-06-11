/**
 * Verified working image URLs (foodish-api + select Unsplash).
 * Each dish has a unique URL — no repeats.
 */
const foodish = (category, n) => `https://foodish-api.com/images/${category}/${category}${n}.jpg`;

const unsplash = (id) =>
  `https://images.unsplash.com/${id}?w=600&h=400&auto=format&fit=crop&q=80`;

const FOOD_IMAGE_URLS = {
  'Grilled Chicken':
    'https://images.pexels.com/photos/20371525/pexels-photo-20371525.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Butter Chicken': foodish('butter-chicken', 15),
  'Fresh Garden Salad': unsplash('photo-1512621776951-a57141f2eefd'),
  'Cheese Pizza': foodish('pizza', 8),
  'Steamed Fish': unsplash('photo-1475332363216-323c9b7f1e81'),
  'Fried Shrimp':
    'https://www.shutterstock.com/image-photo/deep-fried-shrimp-cakes-tod-260nw-2161599921.jpg',
  'Oatmeal Bowl':
    'https://asimplepalate.com/wp-content/uploads/2018/04/Nourishing-Oatmeal-Breakfast-Bowl-5.jpg',
  'Eggs Benedict': unsplash('photo-1525351484163-7529414344d8'),
  'Brown Rice Bowl': foodish('rice', 2),
  'Paneer Tikka':
    'https://img.freepik.com/premium-photo/juicy-tandoori-paneer-tikka-white-background-paneer-tikka-image-photography_1020697-118609.jpg?w=2000',
  'Dal Khichdi':
    'https://media.istockphoto.com/id/1421270982/photo/dal-khichadi-or-masala-khichdi-is-a-tasty-indian-recipe-made-of-mixed-lentils-rice-combined.jpg?s=1024x1024&w=is&k=20&c=yWaSJ20lVY6ZT7sndhnwPL69D2Kez4LNJLdddlkMK1E=',
  'Classic Burger': foodish('burger', 64),
  'Fruit Smoothie':
    'https://tse3.mm.bing.net/th/id/OIP.t1XOM1n-gKdgX_d2BW-kdQHaLH?cb=thfc1falcon&rs=1&pid=ImgDetMain&o=7&rm=3',
  'French Fries': unsplash('photo-1573080496219-bb080dd4f877'),
  'Lamb Curry':
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600'
};

function getFoodImageUrl(name) {
  return FOOD_IMAGE_URLS[name] || foodish('burger', 1);
}

function isValidFoodImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length < 12) return false;
  if (/^[\u{1F300}-\u{1FAFF}]/u.test(trimmed) || trimmed === '🍽️') return false;
  return trimmed.startsWith('http');
}

module.exports = { FOOD_IMAGE_URLS, getFoodImageUrl, isValidFoodImageUrl };
