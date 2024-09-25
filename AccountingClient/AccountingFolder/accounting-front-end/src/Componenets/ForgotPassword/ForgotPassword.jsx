import React from 'react';
import { IoIosMail } from "react-icons/io";
import { FaUser, FaLock } from "react-icons/fa";
import { IoCalendarNumberSharp } from "react-icons/io5";
import './ForgotPassword.css'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const handleForgotSubmit = async (e, email, username, birthYear, navigate) => {
    e.preventDefault();
    try {

        console.log(username)
        //const user = getUserByUsername();
        const loginData = await axios.get(`http://localhost:8080/hey/email/${email}`);
        console.log(loginData.data)
        if (loginData.data.username == username && loginData.data.birthYear == birthYear) {
            alert("Information Matches")
            navigate('/ResetPassword');
        } else if (loginData.data.password != password) {
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

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [birthYear, setBirthYear] = useState('');
    return (
        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainer'>
                <form action="" onSubmit={(e) => handleForgotSubmit(e, email, username, birthYear, navigate)}>
                    <h1>Forgot Password</h1>
                    <div className="input-box">
                        <input type="text" placeholder='E-mail' required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <IoIosMail className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="text" placeholder='Username' required value={username} onChange={(e) => setUsername(e.target.value)} />
                        <FaUser className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="text" placeholder='Birth Year (ex. 1999)' required value={birthYear} onChange={(e) => setBirthYear(e.target.value)} />
                        <IoCalendarNumberSharp className='icon' />
                    </div>

                    <button type="submit">Submit</button>

                    <div className="register-linkForgot">
                        <p>Back to Login? <a href="/">Login</a></p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;