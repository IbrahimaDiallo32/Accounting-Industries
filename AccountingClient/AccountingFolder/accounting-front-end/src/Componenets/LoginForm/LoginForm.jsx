import React from 'react';
import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HomePage from '../home/HomePage';

const currentTime = new Date().toISOString();

const handleLogin = async (e, username, password, navigate) => {
    e.preventDefault();
    console.log("Attempting to log in with:", { username, password });
    try {
        const userData = await axios.get(`http://localhost:8080/hey/username/${username}`);
        console.log("User data retrieved:", userData.data);
        
        if (userData.data.password === password && userData.data.accountStatus === 'active') {
            console.log("Passwords match");

            // Log the login event
            await axios.post('/api/login', { username });
            navigate('/HomePage');
        } else if (userData.data.password !== password) {
            alert("Either username/password is incorrect");
        } else {
            alert("Account is not active");
        }
    } catch (err) {
        alert("Either username/password is incorrect");
        console.error("Login failed:", err);
    }

};


const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainerLogin'>

                <form action="" onSubmit={(e) => handleLogin(e, username, password, navigate)}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' value={username} required onChange={(e) => setUserName(e.target.value)} />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' value={password} required onChange={(e) => setPassword(e.target.value)} />
                        <FaLock className='icon' />
                    </div>

                    <div className="rememeber-forgotLogin">
                        <label><input type="checkbox" />Remember Me</label>
                        <a href="/ForgotPassword">Forgot Password </a>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="/RegistrationForm">Register</a></p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default LoginForm