import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import { FaKey,FaEye,FaEyeSlash, } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleClose = () => {
    navigate("/");
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid institutional email.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }
    if (onLogin) {
      onLogin({ email, password, remember });
    }
    navigate("/dashboard");

  };
  

  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="login-close" onClick={handleClose} >&times;</button>
        <div className="login-box">
          
          <form className="login-form" onSubmit={handleSubmit}>
            <h2 className="login-title">Log In</h2>
            <div className="login-field">
              <label htmlFor="email"><MdMailOutline />Enter Institute's Email ID</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="mail@iiitdmj.ac.in"
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="password"><FaKey />Password</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Must be 8 characters"
                  minLength="8"
                  required
                />
                <button type="button" className="show-password-btn" onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="login-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password-link">Forgot Password?</Link>
            </div>
            {error && <div className="login-error">{error}</div>}
            <button type="submit" className="login-btn">Login</button>
            <div className="login-footer">
              <span>Don't have an account?</span>
              <Link to="/register" className="sign-up-link">Register</Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
