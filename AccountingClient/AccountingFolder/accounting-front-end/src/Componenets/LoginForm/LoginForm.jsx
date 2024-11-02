import React from 'react';
import { useState, useEffect } from 'react';
import './LoginForm.css';
import { FaUser, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
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
        try {
            // Log the login event
            const storedUser = JSON.parse(localStorage.getItem("currentUser"));
            const fullName = storedUser.firstName + " " + storedUser.lastName;
            const response2 = await axios.post('http://localhost:8080/api/create', {
                username: username,
                modifiedBy: fullName,
                eventType: 'User Login',
                dateAndTime: dateAndTimeToday(),
                beforeChange: "~",
                afterChange: "User is now logged in",
                eventID: generateEventId()
            });
        } catch (error) {
            console.error("Error logging event", error);
        }
    };

    const [existingIds, setExistingIds] = useState(new Set()); // Track existing IDs

    const generateEventId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let eventId;

        do {
            eventId = Array.from({ length: 5 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        } while (existingIds.has(eventId)); // Check uniqueness

        return eventId;
    };

    const dateAndTimeToday = () => {
        const today = new Date();
        const thisMonth = today.getMonth() + 1;
        const thisDate = today.getDate();
        const thisYear = today.getFullYear();
        const date = `${thisMonth}/${thisDate}/${thisYear}`;
        const currentTime = today.toLocaleTimeString("en-US", {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        return date + " " + currentTime;
    };

    useEffect(() => {
        const fetchEventLogs = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/getAll');
                const ids = response.data.map(event => event.eventID); // Extract event IDs
                setExistingIds(new Set(ids)); // Store IDs in a Set for quick lookup
            } catch (error) {
                console.error('Error fetching event logs:', error);
            }
        };
        fetchEventLogs();
    }, []);

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