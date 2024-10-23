import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import Avatar from "../../Assets/Avatar";
import { useNavigate } from "react-router-dom";

const Ledger = () => {

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const fullName = storedUser.firstName + " " + storedUser.lastName;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("currentUser"); // Clear user data
        navigate("/loginForm"); // Redirect to login
    };

    const openHelp = () => setIsHelpOpen(true);
    const closeHelp = () => setIsHelpOpen(false);

    const [ledgerAccount, setLedgerAccount] = useState('');

    return (
        <div className="homePageOutermostcontainer">
            <div className="sidebar">
                <div className="profile">
                    <Avatar name={fullName} />
                    <span className="spanForHome">Hello {storedUser.firstName}</span>
                </div>
                <a href="/HomePage" className='spacingHomePage'>Home</a>
                <a href="/DisplayUserList">User List</a>
                <a href="/Accounts">Accounts</a>
                <a href="/EventLog">Event Log</a>
                <a href="/Journalize">Journalize</a>
                <a href="/Ledger">Ledger</a>
                <a href="/LoginForm"><button className="logout-other-button" onClick={handleLogout}>LOGOUT</button></a>
                <a>
                    <button className="helpButton" onClick={openHelp}> Help</button>
                </a>
            </div>
            <div className="main-content">
                <h1>Ledger Main</h1>
                <div> <span> Select Account</span>
                    <select className="chooseAccountForLedger" value={ledgerAccount} onChange={(e) => setLedgerAccount(e.target.value)}></select>
                </div>
            </div>
        </div>
    );
};

export default Ledger;