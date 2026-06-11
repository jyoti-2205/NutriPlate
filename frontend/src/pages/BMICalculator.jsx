import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    const h = Number(height) / 100;
    const w = Number(weight);
    if (!h || !w) return;
    const value = (w / (h * h)).toFixed(1);
    let category = 'Normal';
    let categoryClass = 'normal';
    if (value < 18.5) { category = 'Underweight'; categoryClass = 'warning'; }
    else if (value < 25) { category = 'Normal'; categoryClass = 'normal'; }
    else if (value < 30) { category = 'Overweight'; categoryClass = 'warning'; }
    else { category = 'Obese'; categoryClass = 'danger'; }
    setBmi({ value, category, categoryClass });
    localStorage.setItem('userBmi', JSON.stringify({ value, category, height, weight }));
  };

  return (
    <div className="page">
      <PageHeader
        badge="Health Tool"
        icon="⚖️"
        title="BMI Calculator"
        subtitle="Calculate your Body Mass Index. Saved BMI is used in order health warnings."
      />

      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <form className="card auth-form" onSubmit={calculate}>
          <label>
            Height (cm)
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 170" required />
          </label>
          <label>
            Weight (kg)
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 65" required />
          </label>
          <button type="submit" className="btn btn-primary">Calculate BMI</button>
        </form>

        {bmi && (
          <div className="card bmi-result">
            <span className="label">Your BMI Score</span>
            <div className="bmi-value">{bmi.value}</div>
            <span className={`bmi-category ${bmi.categoryClass}`}>{bmi.category}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BMICalculator;
