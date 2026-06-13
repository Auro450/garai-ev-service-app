import React, { useState } from 'react';
import { ArrowLeft, User, Shield, Info, FileText, LogOut, BadgeCheck, ChevronRight, X, Plus } from 'lucide-react';

export default function Account({ userDetails, onUpdateUserDetails }) {
  const [view, setView] = useState('menu'); // 'menu' | 'personal_details'

  // Form state
  const [formData, setFormData] = useState({
    name: userDetails?.name || '',
    address: userDetails?.address || '',
    phone: userDetails?.phone || '',
    email: userDetails?.email || '',
    scootyModels: userDetails?.scootyModels || [''],
    gender: userDetails?.gender || ''
  });

  const handleScootyModelChange = (index, value) => {
    const newModels = [...formData.scootyModels];
    newModels[index] = value;
    setFormData(prev => ({ ...prev, scootyModels: newModels }));
  };

  const addScootyModel = () => {
    setFormData(prev => ({ ...prev, scootyModels: [...prev.scootyModels, ''] }));
  };

  const removeScootyModel = (index) => {
    const newModels = formData.scootyModels.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, scootyModels: newModels }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'name') {
      finalValue = value.replace(/[0-9]/g, '');
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUserDetails(formData);
    setView('menu');
  };

  if (view === 'personal_details') {
    return (
      <div className="account-page">
        <div className="account-header">
          <ArrowLeft className="back-icon" onClick={() => setView('menu')} />
          <h2 className="header-title">Personal Details</h2>
        </div>

        <div className="account-content">
          <form className="personal-details-form" onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" readOnly style={{ backgroundColor: '#e2e8f0', color: '#64748b', cursor: 'not-allowed' }} required />
            </div>

            <div className="form-group">
              <label>Email ID</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" required />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full address" rows="3" required></textarea>
            </div>

            <div className="form-group">
              <label>Scooty Models</label>
              {formData.scootyModels.map((model, index) => (
                <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    value={model} 
                    onChange={(e) => handleScootyModelChange(index, e.target.value)} 
                    placeholder="E.g. Garai Storm S1" 
                    style={{ flex: 1 }}
                    required 
                  />
                  {formData.scootyModels.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeScootyModel(index)} 
                      style={{ padding: '0 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addScootyModel} 
                style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 0', fontSize: '14px' }}
              >
                <Plus size={16} /> Add another scooter
              </button>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button type="submit" className="btn-primary-wrench btn-full-width" style={{ marginTop: '16px' }}>
              Save Details
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'privacy') {
    return (
      <div className="account-page">
        <div className="account-header">
          <ArrowLeft className="back-icon" onClick={() => setView('menu')} />
          <h2 className="header-title">Privacy & Security</h2>
        </div>
        <div className="account-content" style={{ padding: '24px 20px', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>Data Collection & Usage</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '20px' }}>
            At SG Garai's Electric, we collect only the necessary information (Name, Phone Number, and EV Bike models) required to facilitate smooth service bookings and updates. We do not track your background location or share your personal data with third parties.
          </p>
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>Account Security</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '20px' }}>
            Your account is secured via OTP (One Time Password) verification linked directly to your mobile number. Please ensure you do not share your OTP with anyone to maintain the integrity and privacy of your bookings.
          </p>
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>Data Retention</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6' }}>
            Your service history and personal details are securely stored in our encrypted backend to provide you with seamless future bookings. You reserve the right to request deletion of your account data at any time by contacting our support team.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'terms') {
    return (
      <div className="account-page">
        <div className="account-header">
          <ArrowLeft className="back-icon" onClick={() => setView('menu')} />
          <h2 className="header-title">Terms of Service</h2>
        </div>
        <div className="account-content" style={{ padding: '24px 20px', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>1. Booking Services</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '20px' }}>
            By scheduling a service via this application, you agree to drop off your EV bike at the selected service centre on the preferred date. Cancellations must be made prior to the service status changing to "Completed".
          </p>
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>2. Free Service Eligibility</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '20px' }}>
            The "Free Service" options are strictly applicable to the first 3 services (each within a 3-month span from the original purchase date) of an EV bike bought directly from our dealership. Eligibility will be firmly cross-checked upon physical arrival.
          </p>
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>3. Liability</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6' }}>
            SG Garai's Electric is not liable for indirect or incidental damages arising from missed appointments or delayed service completion due to unforeseen operational constraints at our service centres.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-header">
        <h2 className="header-title">My Profile</h2>
      </div>

      <div className="account-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar-circle">
            <User size={32} color="#0e9f5d" />
          </div>
          <h3 className="profile-phone">{userDetails?.name || userDetails?.phone || '+91-9547934724'}</h3>
          {userDetails?.email && <p style={{ color: '#64748b', fontSize: '13px', marginTop: '-4px', marginBottom: '8px' }}>{userDetails.email}</p>}
          <div className="verified-badge">
            <BadgeCheck size={14} color="#10b981" />
            <span>Verified User</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="menu-list">
          <div className="menu-item" onClick={() => setView('personal_details')}>
            <User className="menu-icon" />
            <span className="menu-text">Personal Details</span>
            <ChevronRight className="menu-chevron" />
          </div>
          <div className="menu-item" onClick={() => setView('privacy')}>
            <Shield className="menu-icon" />
            <span className="menu-text">Privacy and Security</span>
            <ChevronRight className="menu-chevron" />
          </div>
          <div className="menu-item">
            <Info className="menu-icon" />
            <span className="menu-text">About Us</span>
            <ChevronRight className="menu-chevron" />
          </div>
          <div className="menu-item" onClick={() => setView('terms')}>
            <FileText className="menu-icon" />
            <span className="menu-text">Terms of Service</span>
            <ChevronRight className="menu-chevron" />
          </div>
        </div>

        {/* Logout Button */}
        <button className="logout-button" onClick={() => { localStorage.removeItem('currentUserPhone'); window.location.reload(); }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
