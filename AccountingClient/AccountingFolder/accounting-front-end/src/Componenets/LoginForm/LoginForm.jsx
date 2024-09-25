import React from 'react';
import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const handleLogin = async (e, userName, password, navigate) => {
    e.preventDefault();
    try {
        //const user = getUserByUsername();
        const userData = await axios.get(`http://localhost:8080/hey/username/${userName}`);
        if (userData.data.password == password) {
            console.log("passwords match")
            navigate('/HomePage');
        } else if (userData.data.password != password) {
            alert("Either username/password is incorrect")
        } else {
            alert("No")
            return false;
        }
    } catch (err) {
        alert("failure");
        console.error("Login failed");
    }
};

const LoginForm = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainerLogin'>
                <form action="" onSubmit={(e) => handleLogin(e, userName, password, navigate)}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' value={userName} required onChange={(e) => setUserName(e.target.value)} />
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