import React from 'react';
import { IoIosMail } from "react-icons/io";
import { FaUser, FaLock } from "react-icons/fa";
import './ForgotPassword.css'


const ForgotPassword = () => {
    return (
        <div>
            <div>
                <img src="/AIT.png" alt="logo" className='logo' />
            </div>
            <div className='outerContainer'>
                <form action="">
                    <h1>Forgot Password</h1>
                    <div className="input-box">
                        <input type="text" placeholder='E-mail' required />
                        <IoIosMail className='icon' />
                    </div>

                    <div className="input-box">
                        <input type="password" placeholder='User-ID' required />
                        <FaUser className='icon' />
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Back to Login? <a href="/">Login</a></p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;