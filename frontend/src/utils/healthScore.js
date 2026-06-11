export function calculateHealthScore(profile) {
  let score = 100;
  const chol = Number(profile?.cholesterol || 0);
  const sugar = Number(profile?.sugar || 0);
  const bmi = profile?.bmi ? Number(profile.bmi) : null;

  if (chol > 240) score -= 25;
  else if (chol > 200) score -= 15;
  else if (chol > 180) score -= 8;

  if (sugar > 160) score -= 25;
  else if (sugar > 140) score -= 15;
  else if (sugar > 120) score -= 8;

  if (bmi !== null) {
    if (bmi >= 30) score -= 20;
    else if (bmi >= 25) score -= 10;
    else if (bmi < 18.5) score -= 8;
  }

  return Math.max(0, Math.min(100, score));
}

export function getHealthScoreLabel(score) {
  if (score >= 80) return { label: 'Excellent', className: 'green' };
  if (score >= 60) return { label: 'Good', className: 'amber' };
  if (score >= 40) return { label: 'Fair', className: 'amber' };
  return { label: 'Needs Attention', className: 'red' };
}
