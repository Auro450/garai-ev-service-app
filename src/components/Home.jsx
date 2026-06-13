import React, { useState, useRef, useEffect } from 'react';
import { Wrench, Gift, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function Home({ onNavigateToBook, onApplyPromoCode }) {
  const [activeOffer, setActiveOffer] = useState(0);
  const carouselRef = useRef(null);

  const offers = [
    {
      id: 0,
      title: '3 Free Services',
      subtitle: 'After New Purchase',
      code: 'FREESERVICE',
      type: 'green',
      icon: <Gift />
    },
    {
      id: 1,
      title: 'Dedicated In-house Reliable Service',
      subtitle: 'Certified Experts',
      code: 'RELIABLE',
      type: 'glass',
      icon: <ShieldCheck />
    },
    {
      id: 2,
      title: 'Fast Turnaround',
      subtitle: 'Quick & Efficient',
      code: 'FAST',
      type: 'green',
      icon: <Zap />
    },
    {
      id: 3,
      title: 'Free Check',
      subtitle: 'General Inspection',
      code: 'FREEINSP',
      type: 'glass',
      icon: <Sparkles />
    },
    {
      id: 4,
      title: '8-Year Warranty',
      subtitle: 'On Select EV Batteries',
      code: 'WARRANTY8',
      type: 'green',
      icon: <ShieldCheck />
    }
  ];

  // Sync scroll position of carousel with page dots
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const cardWidth = carouselRef.current.offsetWidth * 0.82; // matching flex-basis: 82%
    const index = Math.round(scrollLeft / (cardWidth + 14)); // card width + gap
    if (index >= 0 && index < offers.length) {
      setActiveOffer(index);
    }
  };

  const scrollToOffer = (index) => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.offsetWidth * 0.82;
    carouselRef.current.scrollTo({
      left: index * (cardWidth + 14),
      behavior: 'smooth'
    });
    setActiveOffer(index);
  };

  const handleOfferClick = (code) => {
    onApplyPromoCode(code);
    onNavigateToBook();
  };

  return (
    <div className="animated-page">
      {/* Brand Header */}
      <div className="brand-header" style={{ marginTop: '24px' }}>
        <div className="brand-logo-container">
          <img src="/logo.png" alt="SG Garai Logo" className="brand-logo" />
        </div>
      </div>

      {/* Hero Scooter Banner */}
      <div className="hero-banner">
        <img 
          src="/scooter_banner.png?v=2" 
          alt="SG Garai Electric Scooter" 
          className="hero-image" 
        />
      </div>

      {/* Primary Wrench Service Button */}
      <button className="btn-primary-wrench" onClick={onNavigateToBook}>
        <Wrench />
        Book Service Request
      </button>

      {/* Why Choose Us Section */}
      <div className="section-container">
        <h3 className="section-title">Why Choose Us</h3>
        
        <div className="offers-wrapper">
          <div 
            className="offers-carousel" 
            ref={carouselRef}
            onScroll={handleScroll}
          >
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className={`offer-card offer-card-${offer.type}`}
                onClick={() => handleOfferClick(offer.code)}
              >
                <div className="offer-icon-wrapper">
                  {offer.icon}
                </div>
                <div className="offer-info">
                  <span className="offer-title">{offer.title}</span>
                  <span className="offer-subtitle">{offer.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="carousel-dots">
            {offers.map((_, idx) => (
              <div 
                key={idx} 
                className={`dot ${activeOffer === idx ? 'active' : ''}`}
                onClick={() => scrollToOffer(idx)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      </div>



      {/* Quick Diagnostics & Care */}
      <div className="section-container" style={{ marginTop: '12px', paddingBottom: '24px' }}>
        <h3 className="section-title">Scooter Care & FAQ</h3>
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)', textAlign: 'left' }}>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h5 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>🔋 How to maximize battery life?</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>Keep charge levels between 20% and 80% for daily usage, and avoid charging in extreme heat.</p>
          </div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h5 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>🛑 When should I service brakes?</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>We recommend inspecting brake pads every 3,000 km or if you hear squeaking sounds.</p>
          </div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h5 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>💧 Can I wash my scooter with water?</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>Yes, but avoid high-pressure washing. Use a damp cloth to clean the body and keep water away from electrical components.</p>
          </div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h5 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>⚙️ How often should I check tire pressure?</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>Check tire pressure every 2 weeks. Maintaining the correct pressure ensures optimal range and prevents tire wear.</p>
          </div>
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h5 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>🎁 Are there any free services after purchase?</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>Yes! The first 3 services (each within a span of 3 months from the date of purchase of your EV bike from our dealership) will be absolutely free.</p>
          </div>
          <div>
            <h5 style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)' }}>⏱️ How frequently should I service my EV bike?</h5>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>It's highly recommended to service your bike every 3 months to maintain its best performance and ensure longevity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
