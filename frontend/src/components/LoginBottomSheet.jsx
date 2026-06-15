import React, { useState } from 'react';
import { X, Smartphone, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginBottomSheet({ onClose, onLoginSuccess }) {
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordClicked, setForgotPasswordClicked] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    try {
      if (isSignupMode) {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: mobileNumber, password })
        });

        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "An error occurred during signup.");
          return;
        }

        onLoginSuccess(data);

      } else {
        // Login Mode
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: mobileNumber, password })
        });

        const data = await res.json();
        
        if (!res.ok) {
          setError(data.error || "An error occurred during login.");
          return;
        }

        onLoginSuccess(data);
      }
    } catch (e) {
      setError("Network error. Please make sure the server is running.");
      console.error(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="bottom-sheet" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet-header" style={{ justifyContent: 'space-between', paddingBottom: '12px' }}>
          <div className="bottom-sheet-handle"></div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="bottom-sheet-content" style={{ paddingTop: '16px' }}>
          <div className="login-step-container">
            <div className="login-icon-wrapper">
              {isSignupMode ? <Lock size={32} /> : <Smartphone size={32} />}
            </div>
            <h3 className="login-title">{isSignupMode ? "Create Account" : "Welcome Back"}</h3>
            <p className="login-subtitle">
              {isSignupMode ? "Sign up to start booking services" : "Log in to your account"}
            </p>
            
            <form onSubmit={handleSubmit} className="login-form">
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

              <div className="input-group" style={{ position: 'relative' }}>
                <span className="country-code" style={{ paddingLeft: '14px', paddingRight: '12px' }}><Lock size={18} color="#94a3b8" /></span>
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => {
                    setError('');
                    setPassword(e.target.value);
                  }}
                  className="login-input"
                  style={{ paddingLeft: '12px', paddingRight: '40px' }}
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {isSignupMode && (
                <div className="input-group" style={{ position: 'relative' }}>
                  <span className="country-code" style={{ paddingLeft: '14px', paddingRight: '12px' }}><Lock size={18} color="#94a3b8" /></span>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => {
                      setError('');
                      setConfirmPassword(e.target.value);
                    }}
                    className="login-input"
                    style={{ paddingLeft: '12px', paddingRight: '40px' }}
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {!isSignupMode && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => setForgotPasswordClicked(!forgotPasswordClicked)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {forgotPasswordClicked && !isSignupMode && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#166534', textAlign: 'center', lineHeight: '1.5' }}>
                  Contact <strong>9679399304</strong> or <strong>9775005454</strong> to retrieve your password.
                </div>
              )}

              {error && <div style={{ color: '#ef4444', fontSize: '13px', marginTop: '-8px', marginBottom: '16px', textAlign: 'center', width: '100%', fontWeight: '500' }}>{error}</div>}
              
              <button type="submit" className="btn-primary-wrench btn-full-width">
                {isSignupMode ? "Sign Up" : "Log In"}
              </button>

              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
                {isSignupMode ? "Already have an account?" : "Don't have an account?"}
                <button 
                  type="button" 
                  onClick={() => {
                    setIsSignupMode(!isSignupMode);
                    setError('');
                    setPassword('');
                    setConfirmPassword('');
                    setForgotPasswordClicked(false);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary)', 
                    fontWeight: '600', 
                    marginLeft: '6px', 
                    cursor: 'pointer' 
                  }}
                >
                  {isSignupMode ? "Log In" : "Sign Up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
