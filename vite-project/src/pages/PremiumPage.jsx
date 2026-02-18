import { useState } from 'react';
import './css/PremiumPage.css';


function PremiumPage({}) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    {
      id: 'monthly',
      name: 'Montly',
      price: '99',
      period: 'month',
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '990',
      period: 'year',
      discount: '%20 Discount',
      popular: true,
    },
  ];

  const features = [
    {
      icon: '🐾',
      title: 'Unlimited Pet Profiles',
      description: 'Create and manage unlimited profiles for all your pets',
      free: 'Only 1 pet',
      premium: 'Unlimited',
    },
    {
      icon: '🤖',
      title: 'Advanced AI Analysis',
      description: 'More detailed health analysis with GPT-4',
      free: 'GPT-3.5',
      premium: 'GPT-4',
    },
    
    {
      icon: '🔔',
      title: 'Vaccine & Checkup Reminders',
      description: 'Automatic reminders for vaccinations and vet visits',
      free: '❌',
      premium: '✅',
    },
    
  ];

  const handleSubscribe = () => {
    alert(
      'Will be added later \nSeçilen plan: ' +
        plans.find((p) => p.id === selectedPlan).name
    );
  };

  return (
    <div className="premium-page">
      

      <div className="premium-container">
        <div className="premium-hero">
          <div className="hero-content">
            <span className="hero-badge">⭐ Premium</span>
            <h1>The best experience for your pets</h1>
            <p>
              Upgrade to PetPlus Premium for unlimited pet profiles, advanced AI health analysis, and exclusive features that give your furry friends the care they deserve!
            </p>
          </div>
        </div>

        <div className="plans-section">
          <h2>🎯 Select plan</h2>
          <div className="plans-grid">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${
                  plan.popular ? 'popular' : ''
                }`}
                onClick={() => setSelectedPlan(plan.id)}
                data-testid={`plan-${plan.id}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                {plan.discount && <div className="discount-badge">{plan.discount}</div>}

                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="currency">TL</span>
                  <span className="period">/ {plan.period}</span>
                </div>

                <div className="plan-check">
                  {selectedPlan === plan.id ? (
                    <span className="check-icon">✅</span>
                  ) : (
                    <div className="check-circle"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-section">
          <h2>✨ Premium Features</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="card feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-comparison">
                  <div className="comparison-item">
                    <span className="comparison-label">Free</span>
                    <span className="comparison-value free">{feature.free}</span>
                  </div>
                  <div className="comparison-divider"></div>
                  <div className="comparison-item">
                    <span className="comparison-label">Premium</span>
                    <span className="comparison-value premium">{feature.premium}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cta-section">
          <div className="card cta-card">
            <h2>🚀 Start Now!</h2>
            <p>
              Selected plan:{' '}
              <strong>{plans.find((p) => p.id === selectedPlan).name}</strong>
            </p>
            <div className="cta-price">
              <span className="cta-amount">
                {plans.find((p) => p.id === selectedPlan).price} TL
              </span>
              <span className="cta-period">
                / {plans.find((p) => p.id === selectedPlan).period}
              </span>
            </div>
            <button
              className="btn-premium btn-large"
              onClick={handleSubscribe}
              data-testid="subscribe-btn"
            >
              ⭐ Switch to Premium
            </button>
            <p className="cta-note">
              🔒 Secure payment | ❌ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumPage;


