import { useState } from 'react';
import { supabase } from '../lib/supabase';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

        <input 
          className="input" 
          name="email" 
          placeholder="Email" 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          className="input" 
          name="password" 
          placeholder="Password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" className="button-confirm" disabled={loading}>
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
