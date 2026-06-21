import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <form className="form">
        <div className="title">Welcome,<br/><span>Log in to continue</span></div>
        <input className="input" name="email" placeholder="Email" type="email" />
        <input className="input" name="password" placeholder="Password" type="password" />
        <button type="button" className="button-confirm">Let's go →</button>
        <button type="button" className="button-confirm button-home" onClick={() => window.location.hash = ''}>Go Home</button>
      </form>
    </div>
  );
};

export default LoginPage;
