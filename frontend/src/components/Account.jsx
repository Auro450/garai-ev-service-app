import React, { useState } from 'react';
import { ArrowLeft, User, Shield, Info, FileText, LogOut, BadgeCheck, ChevronRight, X, Plus } from 'lucide-react';

export default function Account({ userDetails, onUpdateUserDetails }) {
  const [view, setView] = useState(() => {
    return sessionStorage.getItem('accountView') || 'menu';
  });

  React.useEffect(() => {
    sessionStorage.setItem('accountView', view);
  }, [view]);

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
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" />
            </div>

            <div className="form-group">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Enter your full address" rows="3"></textarea>
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
            The "Free Service" options are strictly applicable to the first 4 services (each within a 3-month span from the original purchase date) of an EV bike bought directly from our dealership. Eligibility will be firmly cross-checked upon physical arrival.
          </p>
          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700' }}>3. Liability</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6' }}>
            SG Garai's Electric is not liable for indirect or incidental damages arising from missed appointments or delayed service completion due to unforeseen operational constraints at our service centres.
          </p>
        </div>
      </div>
    );
  }

  if (view === 'about') {
    return (
      <div className="account-page">
        <div className="account-header">
          <ArrowLeft className="back-icon" onClick={() => setView('menu')} />
          <h2 className="header-title">About Us</h2>
        </div>
        <div className="account-content" style={{ padding: '24px 20px', overflowY: 'auto' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(18, 183, 106, 0.15) 0%, rgba(18, 183, 106, 0.05) 100%)', padding: '24px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(18, 183, 106, 0.2)', boxShadow: '0 4px 12px rgba(18, 183, 106, 0.05)' }}>
            <h3 style={{ marginTop: 0, fontSize: '20px', color: 'var(--primary-dark)', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.3px' }}>Driving the Future of Mobility</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', margin: 0 }}>
              Welcome to SG Automobiles, one of the largest and most trusted electric scooter dealerships in Nadia, West Bengal. With a strong commitment to sustainable transportation, we are dedicated to making eco-friendly mobility accessible, affordable, and reliable for everyone.
            </p>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '20px' }}>
            As a leading multi-brand electric two-wheeler dealership, SG Automobiles proudly offers a wide range of electric scooters from renowned brands such as{' '}
            <span style={{ fontWeight: 600, color: 'var(--primary-dark)', backgroundColor: 'rgba(18, 183, 106, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(18, 183, 106, 0.3)', display: 'inline-block', margin: '2px 0' }}>HOP</span>,{' '}
            <span style={{ fontWeight: 600, color: 'var(--primary-dark)', backgroundColor: 'rgba(18, 183, 106, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(18, 183, 106, 0.3)', display: 'inline-block', margin: '2px 0' }}>Ampere</span>,{' '}
            <span style={{ fontWeight: 600, color: 'var(--primary-dark)', backgroundColor: 'rgba(18, 183, 106, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(18, 183, 106, 0.3)', display: 'inline-block', margin: '2px 0' }}>Yo Bikes</span> and{' '}
            <span style={{ fontWeight: 600, color: 'var(--primary-dark)', backgroundColor: 'rgba(18, 183, 106, 0.15)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(18, 183, 106, 0.3)', display: 'inline-block', margin: '2px 0' }}>Hindustan Powers</span>.
            Whether you are looking for a daily commuter, a cost-effective mobility solution, or a greener alternative to conventional vehicles, we have the perfect electric scooter for your needs.
          </p>

          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '24px' }}>
            Our extensive network of showrooms and service centers ensures that customers receive not only quality products but also exceptional after-sales support. With years of experience and a customer-first approach, we continue to be a preferred destination for electric mobility solutions across Nadia and surrounding regions.
          </p>

          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700', borderBottom: '2px solid rgba(18, 183, 106, 0.2)', paddingBottom: '8px', marginBottom: '16px' }}>Our Branches</h3>

          {[
            { name: "Krishnanagar Main Showroom", addr: "College Street, Singha Darja More, Krishnanagar, Nadia – 741101", phone: "0715855454 / 9673039304" },
            { name: "Kolkata Branch", addr: "261/1 Duttabad Road, Kolkata – 700064 (Opposite Bidhan Garden Banquet)", phone: "9090422966" },
            { name: "Bhatjangla Branch", addr: "Opposite Mother's Hut, Bhatjangla, Krishnanagar, Nadia – 741102", phone: "7560901151" },
            { name: "Habibpur Branch", addr: "NH-12, Near BDO Office, Ranaghat, Nadia – 741402", phone: "9605771153" },
            { name: "Haskhali Branch", addr: "Haskhali BDO Office Bus Stand, Haskhali, Nadia – 741505", phone: "9775004338" },
            { name: "Asannagar Branch", addr: "Tetultala Bus Stand, Asannagar, Nadia – 741161", phone: "8345001151" },
            { name: "Bagula Branch", addr: "Near Bagula Bus Stand, Opposite Mio Amore, Bagula – 741502", phone: "9775003864" },
            { name: "Bethua Branch", addr: "Bethua Kanthalberia, Shimultala", phone: "8750885209" },
            { name: "Palpara Branch", addr: "Bastra Bazar Opposite, Krishnanagar, Nadia", phone: "9775001173" }
          ].map((branch, i) => (
            <div key={i} style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: 'var(--text-main)' }}>{branch.name}</h4>
              <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-sub)', marginBottom: '4px' }}>
                <span>📍</span> <span style={{ lineHeight: '1.4' }}>{branch.addr}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-sub)' }}>
                <span>📞</span> <span>{branch.phone}</span>
              </div>
            </div>
          ))}

          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700', borderBottom: '2px solid rgba(18, 183, 106, 0.2)', paddingBottom: '8px', marginTop: '24px', marginBottom: '16px' }}>Authorized Service Centers</h3>

          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '16px' }}>
            At SG Automobiles, our relationship with customers continues long after the purchase. Our dedicated service centers are equipped to provide professional maintenance, repairs, diagnostics, and support to keep your electric scooter running smoothly.
          </p>

          {[
            { name: "Ghurni Workshop", addr: "Near Ghurni Godown More, Haranagar Road", phone: "9775001165" },
            { name: "Bhatjangla Workshop", addr: "Opposite Mother's Hut, Bhatjangla", phone: "9775001164" },
            { name: "Bethua Service Centre", addr: "Bethua Kanthalberia, Shimultala", phone: "8759885209" },
            { name: "Habibpur Service Centre", addr: "NH-12, Near BDO Office, Habibpur, Ranaghat, Nadia – 741402", phone: "9609771153" },
            { name: "Asannagar Service Centre", addr: "Near Tetultala Bus Stand, Asannagar – 741161", phone: "8345901151" }
          ].map((center, i) => (
            <div key={i} style={{ marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: 'var(--text-main)' }}>{center.name}</h4>
              <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-sub)', marginBottom: '4px' }}>
                <span>📍</span> <span style={{ lineHeight: '1.4' }}>{center.addr}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-sub)' }}>
                <span>📞</span> <span>{center.phone}</span>
              </div>
            </div>
          ))}

          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700', borderBottom: '2px solid rgba(18, 183, 106, 0.2)', paddingBottom: '8px', marginTop: '24px', marginBottom: '16px' }}>Why Choose SG Automobiles?</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '14px', color: 'var(--text-sub)' }}>
            {[
              "Trusted Multi-Brand Electric Scooter Dealer",
              "Wide Range of Electric Two-Wheelers",
              "Competitive Pricing & Financing Support",
              "Extensive Branch Network Across Nadia & Kolkata",
              "Dedicated Service & Maintenance Support",
              "Customer-Centric Approach",
              "Promoting Sustainable and Green Mobility"
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', lineHeight: '1.4' }}>
                <span>✅</span> <span>{item}</span>
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '8px' }}>Our Vision</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '20px' }}>
            To accelerate the adoption of electric mobility by providing reliable, innovative, and affordable transportation solutions while contributing to a cleaner and greener future.
          </p>

          <h3 style={{ fontSize: '16px', color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '8px' }}>Our Mission</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-sub)', lineHeight: '1.6', marginBottom: '24px' }}>
            To deliver exceptional customer experiences through quality products, professional service, and a strong support network that empowers communities to embrace sustainable transportation.
          </p>

          <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '16px', padding: '16px', backgroundColor: 'rgba(18, 183, 106, 0.1)', borderRadius: '12px' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--primary-dark)' }}>
              SG Automobiles – Powering Tomorrow, Electrically.
            </p>
          </div>

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
          <h3 className="profile-phone" style={{ marginBottom: '4px' }}>{userDetails?.name || 'User'}</h3>
          <p style={{ color: '#475569', fontSize: '14px', fontWeight: '500', marginBottom: userDetails?.email ? '2px' : '8px' }}>
            +91-{userDetails?.phone || 'XXXXXXXXXX'}
          </p>
          {userDetails?.email && <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>{userDetails.email}</p>}
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
          <div className="menu-item" onClick={() => setView('about')}>
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
        <button className="logout-button" onClick={() => { 
          localStorage.removeItem('currentUserPhone'); 
          localStorage.setItem('activeTab', 'home');
          window.location.reload(); 
        }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
