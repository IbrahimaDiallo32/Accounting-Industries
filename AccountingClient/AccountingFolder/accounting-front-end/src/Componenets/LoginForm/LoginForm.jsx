import React from 'react';
import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const handleLogin = async (e, username, password, navigate) => {
    e.preventDefault();
    try {
        const userData = await axios.get(`http://localhost:8080/hey/username/${username}`); //Getting all the information for a user given this username
        console.log(userData)
        if (userData.data.password === password && (userData.data.accountStatus.toLowerCase() === 'active')) {

            console.log("passwords match");

            const currentUserInformation = {
                firstName: userData.data.firstName,
                lastName: userData.data.lastName,
                username: userData.data.username,
                accountType: userData.data.accountType,
                isActive: userData.data.isActive,
            };
            localStorage.setItem("currentUser", JSON.stringify(currentUserInformation));

            navigate('/HomePage');
        } else if (userData.data.password != password || userData.data.accountStatus == 'inactive') {
            alert("Either username/password is incorrect or account is inactive")
        } else {
            alert("No")
            return false;
        }
    } catch (err) {
        alert("Either username/password is incorrect");
        console.error("Login failed");
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