import React from 'react';
import { useState } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { getUserByUsername } from '../../api/axiosConfiguration';

// const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//         const repo = getUserByUsername();
//         const response = await axios.get(API_URLS);
//         if (response.password == password) {
//             console.log("i guess")
//         }
//         Console.log("guess notttt guess")
//         // if (response.status === 200) {
//         //     console.log("Login successful");
//         //     // Optionally, save a token to localStorage for authentication
//         //     localStorage.setItem("token", response.data);
//         // }
//     } catch (err) {
//         alert("failure");
//         console.error("Login failed");
//         // Display error to user
//     }
//     Console.log("stress")
// };

const LoginForm = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    return (

        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainerLogin'>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' value={userName} required onChange={(e) => setUserName(e.target.value)} />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' value={password} required onChange={(e) => setPassword(e.target.value)} />
                        <FaLock className='icon' />
                    </div>

                    <div className="rememeber-forgot">
                        <label><input type="checkbox" />Remember Me</label>
                        <a href="/ForgotPassword">Forgot Password </a>
                    </div>

                    <button type="submit"><a href="/HomePage">Login</a></button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="/RegistrationForm">Register</a></p>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default LoginForm