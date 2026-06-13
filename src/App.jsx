import React, { useState, useEffect } from 'react';
import { Home as HomeIcon, Calendar, User, MessageSquare, Wifi, Battery } from 'lucide-react';
import Home from './components/Home';
import Bookings from './components/Bookings';
import Account from './components/Account';
import Support from './components/Support';
import LoginBottomSheet from './components/LoginBottomSheet';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [promoCode, setPromoCode] = useState('');
  const [systemTime, setSystemTime] = useState('09:41');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const savedPhone = localStorage.getItem('currentUserPhone');
    if (savedPhone) {
      fetch(`http://localhost:3000/users`)
        .then(res => res.json())
        .then(data => {
          const user = data.find(u => u.phone === savedPhone);
          setUserDetails(user || { phone: savedPhone });
          setIsLoggedIn(true);
        })
        .catch(e => console.error(e));
    }
  }, []);

  const handleUpdateUserDetails = async (details) => {
    setUserDetails(details);
    try {
      const res = await fetch(`http://localhost:3000/users`);
      const data = await res.json();
      const existingUser = data.find(u => u.phone === details.phone);
      if (existingUser) {
        await fetch(`http://localhost:3000/users/${existingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details)
        });
      } else {
        await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(details)
        });
      }
    } catch (e) { console.error("API error", e); }
  };

  const handleNavigation = (tab) => {
    if ((tab === 'bookings' || tab === 'account') && !isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (userDetails?.phone) {
      fetch(`http://localhost:3000/bookings`)
        .then(res => res.json())
        .then(data => {
          const userBookings = data.filter(b => b.customerPhone === userDetails.phone);
          setBookings(userBookings);
        })
        .catch(e => console.error("API error", e));
    } else {
      setBookings([]);
    }
  }, [userDetails?.phone]);

  // Update status bar time dynamically to match current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      setSystemTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleAddBooking = async (newBooking) => {
    setBookings((prev) => {
      const updated = [newBooking, ...prev];
      return updated;
    });
    try {
      await fetch('http://localhost:3000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBooking, id: newBooking.id.toString() })
      });
    } catch (e) { console.error("API error", e); }
  };

  const handleCancelBooking = async (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    try {
      await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: 'DELETE'
      });
    } catch (e) { console.error("API error", e); }
  };

  const handleApplyPromoCode = (code) => {
    setPromoCode(code);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            onNavigateToBook={() => handleNavigation('bookings')} 
            onApplyPromoCode={handleApplyPromoCode}
          />
        );
      case 'bookings':
        return (
          <Bookings 
            bookings={bookings} 
            onAddBooking={handleAddBooking} 
            onCancelBooking={handleCancelBooking}
            promoCode={promoCode}
            onApplyPromoCode={handleApplyPromoCode}
            userDetails={userDetails}
          />
        );
      case 'account':
        return <Account userDetails={userDetails} onUpdateUserDetails={handleUpdateUserDetails} />;
      case 'support':
        return <Support isLoggedIn={isLoggedIn} setShowLoginModal={setShowLoginModal} userDetails={userDetails} />;
      default:
        return (
          <Home 
            onNavigateToBook={() => handleNavigation('bookings')} 
            onApplyPromoCode={handleApplyPromoCode}
          />
        );
    }
  };

  return (
    <>
      {/* Background canvas for desktop layout */}
      <div className="desktop-bg-pattern"></div>

      {/* Premium device frame container */}
      <div className="device-frame">
        <div className="device-screen">
          
          {/* iOS-styled Status Bar */}
          <div className="status-bar">
            <span>{systemTime}</span>
            <div className="status-bar-icons">
              <span style={{ fontSize: '11px', letterSpacing: '-0.3px', marginRight: '2px' }}>5G</span>
              <Wifi style={{ width: '14px', height: '14px' }} />
              <Battery style={{ width: '18px', height: '18px', transform: 'rotate(0deg)' }} />
            </div>
          </div>

          {/* Viewport rendering currently active tab */}
          <div className="content-viewport">
            {renderContent()}
          </div>

          {/* iOS bottom tab bar */}
          <nav className="bottom-nav">
            <button 
              className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigation('home')}
            >
              <HomeIcon />
              <span>Home</span>
            </button>
            <button 
              className={`bottom-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => handleNavigation('bookings')}
            >
              <Calendar />
              <span>Bookings</span>
            </button>
            <button 
              className={`bottom-nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => handleNavigation('account')}
            >
              <User />
              <span>Account</span>
            </button>
            <button 
              className={`bottom-nav-item ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => handleNavigation('support')}
            >
              <MessageSquare />
              <span>Support</span>
            </button>
          </nav>

          {/* iOS swipe Home Indicator Bar */}
          <div className="home-indicator"></div>
          
          {showLoginModal && (
            <LoginBottomSheet 
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={async (mobileNum) => {
                try {
                  const res = await fetch(`http://localhost:3000/users`);
                  const data = await res.json();
                  const existingUser = data.find(u => u.phone === mobileNum);
                  
                  let user = existingUser || { phone: mobileNum };
                  
                  localStorage.setItem('currentUserPhone', mobileNum);
                  setUserDetails(user);
                  setIsLoggedIn(true);
                  setShowLoginModal(false);
                  setActiveTab('bookings');
                } catch (e) {
                  console.error("API Error", e);
                }
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;
