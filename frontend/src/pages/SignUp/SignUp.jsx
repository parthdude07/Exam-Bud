import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import './SignUp.css';
import { FaKey } from "react-icons/fa";
import { MdMailOutline } from "react-icons/md";

const SignUp = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    navigate("/");
  };

  const validateEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@iiitdmj\.ac\.in$/.test(email);
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
    <div className="SignUp-overlay">
      <div className="SignUp-container">
        <button className="SignUp-close" onClick={handleClose} >&times;</button>
        <div className="SignUp-box">

          <form className="SignUp-form" onSubmit={handleSubmit}>
            <h2 className="SignUp-title">Sign Up</h2>
            <div className="SignUp-field">
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
            <div className="SignUp-field">
              <label htmlFor="password"><FaKey />Create Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Must be 8 characters"
                  minLength="8"
                  required
                />
            </div>
            <div className="SignUp-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Remember me
              </label>
            </div>
            {error && <div className="SignUp-error">{error}</div>}
            <button type="submit" className="SignUp-btn">Sign Up</button>
            <div className="SignUp-footer">
              <span>Already have an account?</span>
              <Link to="/login" className="login-link">Log In</Link>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default SignUp;
