import React, { useState, useRef } from 'react';
import { X, Smartphone } from 'lucide-react';

export default function LoginBottomSheet({ onClose, onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setError('');
      setStep(2);
    } else {
      setError("Please enter a valid 10-digit mobile number.");
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join('').length === 4) {
      setError('');
      onLoginSuccess(mobileNumber);
    } else {
      setError("Please enter all 4 digits of the OTP.");
    }
  };

  const handleOtpChange = (index, e) => {
    setError('');
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    if (val && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-header" style={{ justifyContent: step === 2 ? 'flex-end' : 'space-between', paddingBottom: step === 2 ? '0' : '12px' }}>
          {step === 1 && <div className="bottom-sheet-handle"></div>}
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="bottom-sheet-content" style={{ paddingTop: step === 2 ? '8px' : '16px' }}>
          {step === 1 ? (
            <div className="login-step-container">
              <div className="login-icon-wrapper">
                <Smartphone size={32} />
              </div>
              <h3 className="login-title">Welcome to Garai's</h3>
              <p className="login-subtitle">Enter your mobile number to continue</p>
              
              <form onSubmit={handleSendOtp} className="login-form">
                <div className="input-group">
                  <span className="country-code">+91</span>
                  <input 
                    type="tel" 
                    maxLength="10"
                    placeholder="Mobile Number" 
                    value={mobileNumber}
                    onChange={(e) => {
                      setError('');
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 10) setMobileNumber(val);
                    }}
                    className="login-input"
                    autoFocus
                  />
                </div>
                {error && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '-8px', marginBottom: '16px', textAlign: 'center', width: '100%', fontWeight: '500' }}>{error}</div>}
                <button type="submit" className="btn-primary-wrench btn-full-width">
                  Send OTP
                </button>
              </form>
            </div>
          ) : (
            <div className="login-step-container">
              <h3 className="login-title" style={{ fontSize: '22px', color: '#1e293b', marginBottom: '16px' }}>Login or Signup</h3>
              <p className="login-subtitle" style={{ color: '#475569', fontSize: '14px', marginBottom: '32px' }}>
                Enter the 4-digit OTP sent to<br/>
                <strong style={{ color: '#0f172a', display: 'block', marginTop: '6px' }}>+91-{mobileNumber || '8888888888'}</strong>
              </p>
              
              <form onSubmit={handleVerifyOtp} className="login-form" style={{ gap: '0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '32px' }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={inputRefs[idx]}
                      type="tel"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '56px',
                        height: '64px',
                        fontSize: '24px',
                        fontWeight: '700',
                        textAlign: 'center',
                        border: '1px solid #cbd5e1',
                        borderRadius: '12px',
                        backgroundColor: '#ffffff',
                        outline: 'none',
                        color: '#0f172a'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--primary)';
                        e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#cbd5e1';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ))}
                </div>
                {error && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '-20px', marginBottom: '20px', textAlign: 'center', width: '100%', fontWeight: '500' }}>{error}</div>}
                
                <button 
                  type="submit" 
                  className="btn-primary-wrench btn-full-width" 
                  style={{ 
                    borderRadius: '24px', 
                    padding: '16px', 
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  Verify & Login
                </button>
                
                <p style={{ marginTop: '24px', fontSize: '14px', color: '#64748b', textAlign: 'center' }}>
                  Didn't receive OTP? <span style={{ color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>Resend</span>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
