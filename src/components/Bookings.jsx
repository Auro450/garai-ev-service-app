import React, { useState, useEffect } from 'react';
import { Calendar, User, Wrench } from 'lucide-react';

export default function Bookings({ bookings, onAddBooking, onCancelBooking, userDetails }) {
  const [evBike, setEvBike] = useState('');
  const [serviceType, setServiceType] = useState('Free Service 1');
  const [serviceCentre, setServiceCentre] = useState('kolkata');
  const [selectedDate, setSelectedDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (userDetails?.phone) {
      setCustomerPhone(userDetails.phone);
    }
  }, [userDetails?.phone]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    if (!evBike || !selectedDate || !customerName || !customerPhone) {
      alert('Please fill in all required fields.');
      return;
    }

    const refNumber = 'SG-' + Math.floor(100000 + Math.random() * 900000);
    
    const newBooking = {
      id: Date.now(),
      refNumber,
      evBike,
      serviceType,
      serviceCentre,
      date: selectedDate,
      customerName,
      customerPhone,
      notes,
      status: 'Scheduled',
      createdAt: new Date().toLocaleDateString()
    };

    onAddBooking(newBooking);
    setLastBooking(newBooking);
    setIsSuccess(true);
    
    // Reset form fields
    setEvBike('');
    setNotes('');
    setSelectedDate('');
  };

  const handleDownloadBill = (booking) => {
    if (booking.bill) {
      const link = document.createElement('a');
      link.href = booking.bill;
      link.download = booking.billName || `bill_${booking.refNumber}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Downloading bill...');
    } else {
      showToast('No bill generated till now');
    }
  };

  return (
    <div className="animated-page">
      {/* Success Popup */}
      {isSuccess && lastBooking && (
        <div className="modal-overlay" onClick={() => setIsSuccess(false)} style={{ zIndex: 999 }}>
          <div className="success-modal" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '24px', margin: 'auto', width: '90%', maxWidth: '340px' }} onClick={(e) => e.stopPropagation()}>
            <div className="success-icon-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="success-title">Service Booked!</h2>
          <p className="success-desc">Your service appointment has been successfully scheduled and confirmed.</p>
          
          <div className="success-info-card">
            <div className="success-info-row">
              <span className="success-info-label">Reference ID</span>
              <span className="success-info-value" style={{ fontFamily: 'monospace', color: '#12b76a', fontWeight: 'bold' }}>
                {lastBooking.refNumber}
              </span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">EV Bike</span>
              <span className="success-info-value">{lastBooking.evBike}</span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">Service Type</span>
              <span className="success-info-value">{lastBooking.serviceType}</span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">Service Centre</span>
              <span className="success-info-value" style={{ textTransform: 'capitalize' }}>{lastBooking.serviceCentre}</span>
            </div>
            <div className="success-info-row">
              <span className="success-info-label">Date</span>
              <span className="success-info-value">{lastBooking.date}</span>
            </div>
          </div>

          <button className="btn-submit" style={{ width: '100%' }} onClick={() => setIsSuccess(false)}>
            Done
          </button>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <>
          <h2 className="section-title" style={{ marginTop: '8px' }}>Schedule a Service</h2>
          
          <form className="booking-form-card" onSubmit={handleBookingSubmit}>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">EV bike *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your EV bike name manually"
                value={evBike}
                onChange={(e) => setEvBike(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Service Type *</label>
              <select 
                className="form-select"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              >
                <option value="Free Service 1">Free Service 1</option>
                <option value="Free Service 2">Free Service 2</option>
                <option value="Free Service 3">Free Service 3</option>
                <option value="others">others</option>
              </select>
              <p style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '6px', fontStyle: 'italic', lineHeight: '1.4' }}>
                *Free services will be cross checked upon your arrival in service centre.
              </p>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Service Centre *</label>
              <select 
                className="form-select"
                value={serviceCentre}
                onChange={(e) => setServiceCentre(e.target.value)}
              >
                <option value="kolkata">Kolkata</option>
                <option value="krishnagar">Krishnagar</option>
                <option value="bethudahari">Bethudahari</option>
                <option value="paninala">Paninala</option>
                <option value="bhimpur">Bhimpur</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Preferred Date *</label>
              <input 
                type="date"
                className="form-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Your Full Name *</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Alex Garai"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value.replace(/[0-9]/g, ''))}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Phone Number *</label>
              <input 
                type="tel" 
                className="form-input" 
                placeholder="Enter 10-digit number"
                value={customerPhone}
                onChange={(e) => {
                  if (userDetails?.phone) return;
                  const numsOnly = e.target.value.replace(/\D/g, '');
                  if (numsOnly.length <= 10) setCustomerPhone(numsOnly);
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

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Service Notes / Issues</label>
              <textarea 
                className="form-textarea" 
                placeholder="Describe any issues e.g., creaking front suspension..."
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-submit" style={{ marginTop: '16px' }}>
              Confirm Service Request
            </button>
          </form>

          {/* Active Bookings list */}
          <div className="section-container" style={{ marginTop: '12px' }}>
            <h3 className="section-title" style={{ marginBottom: '4px' }}>My Bookings ({bookings.length})</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginBottom: '16px', lineHeight: '1.4' }}>
              *Note: Service dates and types are subject to admin review and may change upon arrival.
            </p>
            <div className="bookings-list">
              {bookings.length === 0 ? (
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '14px', border: '1px solid #e2e8f0' }}>
                  <Wrench style={{ width: '32px', height: '32px', color: '#94a3b8', margin: '0 auto 8px auto', strokeWidth: 1.5 }} />
                  <p>No upcoming service appointments.</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="booking-item-card">
                    <div className="booking-item-header">
                      <span className="booking-item-title" style={{ fontFamily: 'monospace', fontSize: '15px' }}>{booking.refNumber}</span>
                      <span className={`status-badge status-${booking.status === 'Scheduled' ? 'scheduled' : booking.status === 'In Progress' ? 'progress' : 'completed'}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="booking-item-details">
                      <div className="booking-detail-row">
                        <Wrench size={14} style={{ marginRight: '6px', color: 'var(--primary)' }} />
                        <span style={{ fontWeight: 600 }}>{booking.serviceType}</span>
                      </div>
                      <div className="booking-detail-row">
                        <User size={14} style={{ marginRight: '6px' }} />
                        <span>{booking.evBike || booking.scooterModel} • {booking.customerName}</span>
                      </div>
                      <div className="booking-detail-row">
                        <Calendar size={14} style={{ marginRight: '6px' }} />
                        <span style={{ textTransform: 'capitalize' }}>{booking.date} {booking.serviceCentre ? `• ${booking.serviceCentre}` : ''}</span>
                      </div>
                      {booking.notes && (
                        <div style={{ marginTop: '4px', fontSize: '12px', paddingLeft: '20px', fontStyle: 'italic', borderLeft: '2px solid #e2e8f0' }}>
                          "{booking.notes}"
                        </div>
                      )}
                    </div>

                    <div className="booking-item-actions">
                      <button 
                        type="button" 
                        onClick={() => handleDownloadBill(booking)} 
                        style={{ alignSelf: 'center', marginRight: 'auto', fontSize: '12px', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                      >
                        Download your service bill
                      </button>
                      {booking.status === 'Scheduled' && (
                        <button 
                          className="btn-action-outline btn-action-cancel"
                          onClick={() => onCancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>

      {/* Toast Notification */}
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
