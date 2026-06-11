function assessFoodRisk(user, food) {
  const userChol = Number(user?.cholesterol || 0);
  const userSugar = Number(user?.sugar || 0);
  const foodChol = Number(food?.cholesterol || 0);
  const reasons = [];

  if (userChol > 200 && foodChol > 50) {
    reasons.push(
      `Your cholesterol is ${userChol} mg/dL (high). This food has ${foodChol} mg cholesterol.`
    );
  } else if (userChol > 180 && foodChol > 80) {
    reasons.push(
      `Your cholesterol is ${userChol} mg/dL (borderline). ${food.name} is high in cholesterol (${foodChol} mg).`
    );
  }

  if (userSugar > 140 && food.category === 'Risky') {
    reasons.push(
      `Your blood sugar is ${userSugar} mg/dL (elevated). ${food.name} may worsen your condition.`
    );
  } else if (userSugar > 120 && foodChol > 70) {
    reasons.push(
      `Your sugar level is ${userSugar} mg/dL. This food is not ideal for your health profile.`
    );
  }

  if (food.category === 'Risky' && userChol > 170 && reasons.length === 0) {
    reasons.push(`${food.name} is marked risky and may not suit your current health stats.`);
  }

  return {
    isRisky: reasons.length > 0,
    reasons,
    level: reasons.length > 1 ? 'high' : reasons.length === 1 ? 'medium' : 'low'
  };
}

module.exports = { assessFoodRisk };
