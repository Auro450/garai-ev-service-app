import React, { useState, useEffect } from 'react';

export default function Support({ isLoggedIn, setShowLoginModal, userDetails }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [issue, setIssue] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [myTickets, setMyTickets] = useState([]);

  const fetchTickets = () => {
    if (userDetails?.phone) {
      fetch('http://localhost:3000/tickets')
        .then(res => res.json())
        .then(data => {
          const userTickets = data.filter(t => t.customerPhone === userDetails.phone);
          // Sort newest first
          userTickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setMyTickets(userTickets);
        })
        .catch(err => console.error(err));
    }
  };

  useEffect(() => {
    if (userDetails?.phone) {
      setPhone(userDetails.phone);
      if (userDetails?.name && !name) {
        setName(userDetails.name);
      }
    }
    fetchTickets();
  }, [userDetails?.phone, userDetails?.name]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const ticketData = {
      id: Date.now().toString(),
      customerName: name,
      customerPhone: phone,
      issueDescription: issue,
      timestamp: new Date().toISOString(),
      status: 'Open'
    };
    
    try {
      await fetch('http://localhost:3000/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      console.log("Ticket successfully stored in DB:", ticketData);
      fetchTickets();
    } catch (err) {
      console.error("Failed to store ticket", err);
    }

    // Show popup notification
    showToast('Our representative will call you shortly');
    
    // Clear form after successful submission
    setName('');
    setPhone('');
    setIssue('');
  };

  return (
    <div className="animated-page">
      <h2 className="section-title" style={{ marginTop: '8px' }}>Support & Help</h2>
      
      {/* Top 1/3 Ticket Box */}
      <div className="section-container" style={{ marginTop: '16px' }}>
        <h3 className="section-title" style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '16px' }}>Raise a Ticket</h3>
        
        {isLoggedIn ? (
          <form className="booking-form-card" onSubmit={handleSubmit} style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[0-9]/g, ''))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => {
                  if (userDetails?.phone) return; // Locked if logged in
                  const numsOnly = e.target.value.replace(/\D/g, '');
                  if (numsOnly.length <= 10) setPhone(numsOnly);
                }}
                readOnly={!!userDetails?.phone}
                style={{
                  backgroundColor: userDetails?.phone ? '#f1f5f9' : 'white',
                  cursor: userDetails?.phone ? 'not-allowed' : 'text',
                  color: userDetails?.phone ? '#64748b' : 'inherit'
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Describe your issue *</label>
              <textarea 
                className="form-textarea" 
                placeholder="Write anything you want to..."
                rows="4"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" style={{ marginTop: '8px' }}>
              Submit Ticket
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
              You must be logged in to raise a support ticket so our team can contact you.
            </p>
            <button 
              className="btn-submit" 
              onClick={() => setShowLoginModal(true)}
            >
              Login Now
            </button>
          </div>
        )}
      </div>

      {/* My Tickets Section */}
      {isLoggedIn && myTickets.length > 0 && (
        <div className="section-container" style={{ marginTop: '24px' }}>
          <h3 className="section-title" style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '16px' }}>My Tickets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myTickets.map(ticket => (
              <div key={ticket.id} style={{
                backgroundColor: ticket.status === 'Closed' ? '#ecfdf5' : 'white',
                border: `1px solid ${ticket.status === 'Closed' ? '#10b981' : '#e2e8f0'}`,
                borderLeft: `4px solid ${ticket.status === 'Closed' ? '#10b981' : '#f59e0b'}`,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{new Date(ticket.timestamp).toLocaleDateString()}</span>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: ticket.status === 'Closed' ? '#10b981' : '#f59e0b',
                    backgroundColor: ticket.status === 'Closed' ? '#d1fae5' : '#fef3c7',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {ticket.status || 'Open'}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#334155', fontStyle: 'italic' }}>
                  "{ticket.issueDescription}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dealership Details Section */}
      <div className="section-container" style={{ marginTop: '24px', marginBottom: '24px' }}>
        <h3 className="section-title" style={{ fontSize: '18px', color: 'var(--primary-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📍 Dealership Details
        </h3>
        
        <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h4 style={{ margin: '0 0 16px 0', color: 'var(--text-main)', fontSize: '17px', fontFamily: 'var(--font-heading)' }}>SG Automobile</h4>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '8px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>🗺️</span>
            </div>
            <div>
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '14px', marginBottom: '4px' }}>Location:</strong>
              <span style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: '1.5', display: 'block' }}>
                1, College Street, Nagendranagar, Krishnanagar,<br/>
                West Bengal 741101 (Near College Street Barwari).
              </span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', padding: '8px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '16px' }}>📞</span>
            </div>
            <div>
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '14px', marginBottom: '4px' }}>Contact Numbers:</strong>
              <span style={{ color: 'var(--primary-dark)', fontSize: '15px', fontWeight: '600' }}>
                9679399304 <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '13px', margin: '0 4px' }}>or</span> 9775005454
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Padding for bottom nav */}
      <div style={{ paddingBottom: '100px' }}></div>

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: '500',
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none'
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
