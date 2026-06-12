import React, { useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import api from '../api/api';

import { useAuth } from '../context/AuthContext';

import { useCart } from '../context/CartContext';

import { useToast } from '../context/ToastContext';

import FoodImage from '../components/FoodImage';

import FoodSkeleton from '../components/FoodSkeleton';

import HealthWarningModal from '../components/HealthWarningModal';

import NutritionTags from '../components/NutritionTags';

import PageHeader from '../components/PageHeader';

import { assessFoodRisk } from '../utils/healthCheck';

import { getFavorites, toggleFavorite } from '../utils/favorites';

import { formatPrice } from '../utils/formatPrice';



const FoodList = () => {

  const { user } = useAuth();

  const { addToCart } = useCart();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);

  const [filter, setFilter] = useState('all');

  const [mealType, setMealType] = useState('all');

  const [search, setSearch] = useState('');

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [favorites, setFavorites] = useState(getFavorites());

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  const [selectedFood, setSelectedFood] = useState(null);

  const [riskInfo, setRiskInfo] = useState(null);

  const [showFirstWarning, setShowFirstWarning] = useState(false);



  const loadFoods = async () => {

    setLoading(true);

    setError('');

    try {

      const params = {};

      if (filter !== 'all') params.filter = filter;

      if (mealType !== 'all') params.meal_type = mealType;

      const { data } = await api.get('/foods', { params });

      setFoods(data);

    } catch (err) {

      const msg = err.response?.data?.message || err.message || 'Failed to load foods';

      setError(msg);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadFoods();

  }, [filter, mealType]);



  const displayedFoods = useMemo(() => {

    let list = foods;

    if (search.trim()) {

      const q = search.trim().toLowerCase();

      list = list.filter((f) => f.name.toLowerCase().includes(q) || (f.tags || '').toLowerCase().includes(q));

    }

    if (showFavoritesOnly) {

      list = list.filter((f) => favorites.includes(f.id));

    }

    return list;

  }, [foods, search, showFavoritesOnly, favorites]);



  const goToCheckout = (food, risk) => {

    navigate('/order/checkout', { state: { food, riskInfo: risk } });

  };



  const handleOrderClick = (food) => {

    const risk = assessFoodRisk(user, food);

    if (risk.isRisky) {

      setSelectedFood(food);

      setRiskInfo(risk);

      setShowFirstWarning(true);

    } else {

      goToCheckout(food, risk);

    }

  };



  const handleFavorite = (foodId) => {

    const next = toggleFavorite(foodId);

    setFavorites(next);

  };



  const handleAddToCart = (food) => {

    addToCart(food, 1);

    showToast({ type: 'success', title: 'Added to cart', message: `${food.name} added` });

  };



  return (

    <div className="page">

      <PageHeader

        badge="Menu"

        title="Order Food"

        subtitle="Browse our menu with real photos and prices. Health warnings appear for risky items."

      />



      <div className="menu-toolbar">

        <input

          type="search"

          className="search-input"

          placeholder="Search food by name or tag..."

          value={search}

          onChange={(e) => setSearch(e.target.value)}

        />

        <div className="filter-bar">

          <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>

          <button type="button" className={filter === 'safe' ? 'active' : ''} onClick={() => setFilter('safe')}>Safe</button>

          <button type="button" className={filter === 'risky' ? 'active' : ''} onClick={() => setFilter('risky')}>Risky</button>

          <button type="button" className={mealType === 'Veg' ? 'active' : ''} onClick={() => setMealType(mealType === 'Veg' ? 'all' : 'Veg')}>Veg</button>

          <button type="button" className={mealType === 'Non-Veg' ? 'active' : ''} onClick={() => setMealType(mealType === 'Non-Veg' ? 'all' : 'Non-Veg')}>Non-Veg</button>

          <button type="button" className={showFavoritesOnly ? 'active' : ''} onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>♥ Favorites</button>

        </div>

        <p className="menu-count">{displayedFoods.length} dishes shown</p>

      </div>



      {loading && <FoodSkeleton />}

      {error && (

        <div className="error">

          <strong>Could not load menu</strong>

          <p>{error}</p>

          <p className="hint">Make sure backend is running: <code>cd backend → npm start</code></p>

        </div>

      )}



      {!loading && !error && displayedFoods.length === 0 && (

        <div className="card order-history-empty">

          <p>No foods match your search or filters.</p>

        </div>

      )}



      {!loading && displayedFoods.length > 0 && (

        <div className="food-grid">

          {displayedFoods.map((food) => {

            const risk = assessFoodRisk(user, food);

            const isFav = favorites.includes(food.id);

            return (

              <article key={food.id} className={`card food-card ${risk.isRisky ? 'risky' : 'safe'}`}>

                <div className="food-image-wrap">

                  <FoodImage src={food.image} alt={food.name} />

                  <button

                    type="button"

                    className={`fav-btn ${isFav ? 'active' : ''}`}

                    onClick={() => handleFavorite(food.id)}

                    aria-label="Toggle favorite"

                  >

                    {isFav ? '♥' : '♡'}

                  </button>

                  <span className={`badge food-badge ${risk.isRisky ? 'risky' : 'safe'}`}>

                    {risk.isRisky ? 'Risky for You' : 'Safe for You'}

                  </span>

                </div>

                <div className="food-card-body">

                  <div className="food-title-row">

                    <h3>{food.name}</h3>

                    <span className="food-price">{formatPrice(food.price)}</span>

                  </div>

                  <p className="food-meta">Cholesterol: {food.cholesterol} mg · {food.meal_type}</p>

                  <NutritionTags tags={food.tags} />

                  <div className="food-card-actions">

                    <button type="button" className="btn btn-outline-dark" onClick={() => handleAddToCart(food)}>

                      Add to Cart

                    </button>

                    <button

                      type="button"

                      className={`btn order-btn ${risk.isRisky ? 'btn-danger' : 'btn-primary'}`}

                      onClick={() => handleOrderClick(food)}

                    >

                      Order Now

                    </button>

                  </div>

                </div>

              </article>

            );

          })}

        </div>

      )}



      <HealthWarningModal

        open={showFirstWarning}

        title="Health Warning!"

        message={`${selectedFood?.name} (${formatPrice(selectedFood?.price)}) may not be safe for your health.`}

        reasons={riskInfo?.reasons || []}

        cancelText="Choose Another Food"

        confirmText="Still Order This"

        onCancel={() => { setShowFirstWarning(false); setSelectedFood(null); }}

        onConfirm={() => {

          setShowFirstWarning(false);

          goToCheckout(selectedFood, riskInfo);

          setSelectedFood(null);

        }}

      />

    </div>

  );

};



export default FoodList;

