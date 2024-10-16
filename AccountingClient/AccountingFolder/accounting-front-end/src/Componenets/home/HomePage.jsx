import './HomePage.css';

import { Link } from 'react-router-dom';
import Avatar from '../Assets/Avatar';
import { FaCalendar } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React from 'react';
import { RxAvatar } from "react-icons/rx";
import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { CiCalendar } from "react-icons/ci";
import CalandarPopUp from '../Modal/CalandarPopUp';

const HomePage = ({ userName }) => {
  
  
    const [isCalandarOpen, setIsCalandarOpen] = useState(false);

    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    // Using the userName prop, defaulting to "Ibrahima Diallo" if not provided
    const username = userName || "Ibrahima Diallo";

    return (
        <div className='outerContainers'>
            <div className="homePageOutermostcontainer">
                {/* Sidebar */}
                <div className="sidebar">
                    <div className="profile">
                        <Avatar name={username} />
                        <span className="spanForHome">Hello Alexa</span>
                    </div>
                    <a href="/DisplayUserList" className='spacingHomePage'>User List</a>
                    <a href="/LedgerOfAccounts">Ledger</a>
                    <a href="/Accounts">Accounts</a>
                    <a href="/#">Event Log</a>
                    <a href="/#">Module 4</a>
                    <a href="#">Module 5</a>
                    <a href="/LoginForm"><button className="logout-other-button">Logout</button></a>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <div className="header">
                        <div className="title-logo">
                            <img src="/AIT.PNG" alt="AIT Logo" />
                            <h1>Welcome To Accounting Treasury Industries!</h1>
                        </div>
                        <div className='rightHeader'>
                        <a href="/LoginForm"><button className="logout-btn">LOGOUT</button></a>
                        <button className='Calandar' onClick={openCalandar}><CiCalendar/></button>
                        </div>
                    </div>
                    <Modal isOpen={isCalandarOpen} onClose={closeCalandar}>
                    <CalandarPopUp />
                </Modal>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
