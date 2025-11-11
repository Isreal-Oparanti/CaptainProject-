'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!showLogin && !name) {
      setError('Please enter your name');
      return;
    }
    
    if (!showLogin) {
      setSuccess('Account created successfully! Please login.');
      setShowLogin(true);
      setName('');
      setPassword('');
    } else {
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('user', JSON.stringify({ name: name || 'User', email }));
      router.push('/dashboard');
    }
  };

  const switchForm = () => {
    setShowLogin(!showLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-page">
      <section className="section-login">
        <div><img src="/img/logo.png" alt="Logo" className="login-logo" /></div>
        
        <div className="login">
          <h2 className="form-title">
            {showLogin ? 'Login to Your Account' : 'Create New Account'}
          </h2>
          
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="login--form">
            {!showLogin && (
              <div className="login--form_item">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input" 
                  placeholder="Full Name" 
                  required 
                />
              </div>
            )}
            
            <div className="login--form_item">
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input" 
                placeholder="Email or Phone Number" 
                required 
              />
            </div>
            
            <div className="login--form_item">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input" 
                placeholder="Password" 
                required 
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="btn2">
              <button type="submit" className="btn2 btn2-login enhanced-btn">
                {showLogin ? 'Login' : 'Sign Up'}
              </button>
            </div>
            
            {showLogin && (
              <p className="help"><a href="#">Forgot Password?</a></p>
            )}
          </form>

          <div className="form-switch">
            {showLogin ? (
              <p>Don't have an account? <button onClick={switchForm} className="switch-btn">Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={switchForm} className="switch-btn">Login</button></p>
            )}
          </div>

          <div className="line-text">
            <p className="or">or</p>
          </div>

          <div className="social">
            <ul className="social-media">
              <a href="#" className="social-media-item"><li><i className="fa-brands fa-google"></i></li></a>
              <a href="#" className="social-media-item"><li><i className="fa-brands fa-apple"></i></li></a>
              <a href="#" className="social-media-item"><li><i className="fa-brands fa-windows"></i></li></a>
              <a href="#" className="social-media-item"><li><i className="fa-brands fa-linkedin"></i></li></a>              
            </ul>
          </div>

          <div className="btn2">
            <a href="#" className="btn2 btn2-button enhanced-btn">Sign in with SSO</a>
          </div>
        </div>
      </section>
    </div>
  );
}