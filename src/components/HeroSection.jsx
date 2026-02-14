const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Postpartum Recovery Journey
            <span className="hero-emoji">🌿</span>
          </h1>
          <p className="hero-subtitle">
            Structured support for emotional and physical healing during your recovery.
          </p>
          <p className="hero-description">
            Track your daily wellness, practice mindfulness, and celebrate your progress with our 
            three-phase recovery program designed specifically for postpartum mothers.
          </p>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1493252645019-e70e8267df61?w=500&h=500&fit=crop&q=80" 
            alt="Mother holding baby peacefully"
            className="hero-img"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
