import { useState } from 'react';
import './css/PremiumPage.css';


function PremiumPage({}) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    {
      id: 'monthly',
      name: 'Aylık',
      price: '99',
      period: 'ay',
      popular: false,
    },
    {
      id: 'yearly',
      name: 'Yıllık',
      price: '990',
      period: 'yıl',
      discount: '%20 İndirim',
      popular: true,
    },
  ];

  const features = [
    {
      icon: '🐾',
      title: 'Sınırsız Evcil Hayvan',
      description: 'İstediğiniz kadar evcil hayvan profili oluşturun',
      free: 'Sadece 1',
      premium: 'Sınırsız',
    },
    {
      icon: '🤖',
      title: 'Gelişmiş AI Analizi',
      description: 'GPT-4 ile daha detaylı sağlık analizleri',
      free: 'GPT-3.5',
      premium: 'GPT-4',
    },
    
    {
      icon: '🔔',
      title: 'Aşı Hatırlatıcı',
      description: 'Aşı ve kontrol tarihleri için otomatik bildirimler',
      free: '❌',
      premium: '✅',
    },
    
  ];

  const handleSubscribe = () => {
    alert(
      'Ödeme sistemi entegrasyonu daha sonra eklenecek. \nSeçilen plan: ' +
        plans.find((p) => p.id === selectedPlan).name
    );
  };

  return (
    <div className="premium-page">
      

      <div className="premium-container">
        <div className="premium-hero">
          <div className="hero-content">
            <span className="hero-badge">⭐ Premium</span>
            <h1>Evcil Dostlarınız İçin En İyisi</h1>
            <p>
              Premium üyeliğimizle evcil hayvanlarınızın sağlığını daha iyi takip edin ve
              özel özelliklere erişin
            </p>
          </div>
        </div>

        <div className="plans-section">
          <h2>🎯 Plan Seçimi</h2>
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
                {plan.popular && <div className="popular-badge">En Popüler</div>}
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
          <h2>✨ Premium Özellikler</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="card feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-comparison">
                  <div className="comparison-item">
                    <span className="comparison-label">Ücretsiz</span>
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
            <h2>🚀 Hemen Başlayın!</h2>
            <p>
              Seçtiğiniz plan:{' '}
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
              ⭐ Premium'a Geç
            </button>
            <p className="cta-note">
              🔒 Güvenli ödeme | ❌ İstediğiniz zaman iptal edin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumPage;


