import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <form className="form">
        <div className="title">Welcome,<br/><span>Log in to continue</span></div>
        <input className="input" name="email" placeholder="Email" type="email" />
        <input className="input" name="password" placeholder="Password" type="password" />
        <button type="button" className="button-confirm">Let's go →</button>
      </form>
    </div>
  );
};

export default LoginPage;
