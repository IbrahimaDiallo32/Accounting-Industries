import React from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";

const LoginForm = () => {
    return (
        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainer'>
                <form action="">
                    <h1>Login</h1>
                    <div className="input-box">
                        <input type="text" placeholder='Username' required />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Password' required />
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