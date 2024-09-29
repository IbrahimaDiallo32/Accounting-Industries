import React from 'react';
import { useState } from 'react';
import './ResetPassword.css';
import { FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const handleResetPassword = async (e, password, confirmPassword, navigate) => {
    e.preventDefault();
    try {
        //const user = getUserByUsername();
        //const userData = await axios.get(`http://localhost:8080/hey/username/${userName}`);
        if (password != confirmPassword) {
            alert('Passwords do not match')
        } else {
            alert('Password change was successful')
            navigate('/LoginForm')
            return false;
        }
    } catch (err) {
        alert("failure");
        console.error("Login failed");
    }
};

const LoginForm = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    return (
        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainerLogin'>
                <form action="" onSubmit={(e) => handleResetPassword(e, password, confirmPassword, navigate)}>
                    <h1>Reset Password</h1>
                    <div className="input-box">
                        <input type="password" placeholder='New Password' value={password} required onChange={(e) => setPassword(e.target.value)} />
                        <FaLock className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='Confirm Password' value={confirmPassword} required onChange={(e) => setconfirmPassword(e.target.value)} />
                        <FaLock className='icon' />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>

    );
};

export default LoginForm