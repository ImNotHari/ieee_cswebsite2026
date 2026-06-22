import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = email.length > 0 && password.length > 0 && isEmailValid;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.hash = '#/dashboard';
    }
  };

  return (
    <div className="login-page-container">
      <form className="form" onSubmit={handleLogin}>
        <div className="title">Welcome,<br/><span>Log in to continue</span></div>
        
        {error && <div style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        {emailTouched && email && !isEmailValid && !error && (
          <div style={{ color: '#ff6b6b', marginBottom: '0.5rem', fontSize: '0.85rem', alignSelf: 'flex-start' }}>Please enter a valid email address</div>
        )}

        <input 
          className={`input ${emailTouched && email && !isEmailValid ? 'error' : ''}`} 
          name="email" 
          placeholder="Email *" 
          type="email" 
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          onBlur={() => setEmailTouched(true)}
          autoComplete="email"
          required
        />
        <div style={{ position: 'relative', width: '100%', display: 'flex' }}>
          <input 
            className="input" 
            name="password" 
            placeholder="Password *" 
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            autoComplete="current-password"
            required
            style={{ width: '100%', paddingRight: '2.5rem' }}
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ 
              position: 'absolute', 
              right: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: 'var(--font-color-sub)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            )}
          </button>
        </div>
        
        <button 
          type="submit" 
          className="button-confirm" 
          disabled={loading || !isFormValid}
          style={{ opacity: (!isFormValid) ? 0.5 : 1, cursor: (!isFormValid) ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button type="button" className="button-confirm button-home" onClick={() => window.location.hash = ''}>
          Go Home
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
