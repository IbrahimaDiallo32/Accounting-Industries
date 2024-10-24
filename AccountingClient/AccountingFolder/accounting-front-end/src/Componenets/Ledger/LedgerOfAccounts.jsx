import React from 'react';
import './LedgerOfAccounts.css';
import { RxAvatar } from "react-icons/rx";
import Avatar from '../Assets/Avatar';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const LedgerOfAccounts = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };

    useEffect(() => {
        if (!storedUser) { //if no one is logged it, it automatically navigates back to login page
            navigate("/", { replace: true });
        }
    }, []);


    return (
        <div className='outerContainers'>
            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name={fullName} />
                        <span className="spanForHome">Hello {storedUser.firstName}</span>
                    </div>
                    <a href="/HomePage" className='spacingHomePage'>Home</a>
                    <a href="/DisplayUserList">User List</a>
                    <a href="/Accounts">Accounts</a>
                    <a href="/EventLog">Event Log</a>
                    <a href="/#">Module 5</a>
                    <a><button className="logout-other-button" onClick={handleLogout}>Logout</button></a>
                </div>

                {/* Main Content */}
                <div className="main-content">

                </div>
            </div>
        </div>
    );
};

export default LedgerOfAccounts;
