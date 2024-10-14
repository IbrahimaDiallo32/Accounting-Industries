import React from 'react';
import './HomePage.css';
import { RxAvatar } from "react-icons/rx";
import { useState, useEffect } from 'react';
import Modal from '../Modal/Modal';
import { CiCalendar } from "react-icons/ci";
import Avatar from '../Assets/Avatar';
import CalandarPopUp from '../Modal/CalandarPopUp';


const HomePage = ({ userName }) => {

    const [isCalandarOpen, setIsCalandarOpen] = useState(false);

    const openCalandar = () => setIsCalandarOpen(true);
    const closeCalandar = () => setIsCalandarOpen(false);

    const username = "Ibrahima Diallo";

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
                    <a href="/NewUserForm">New user form</a>
                    <a href="#module5">MODULE 5</a>
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
