import './HomePage.css';
import { Link } from 'react-router-dom';
import Avatar from '../Assets/Avatar';
import { FaCalendar } from "react-icons/fa";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import React from 'react';

const HomePage = ({ userName }) => {
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
                        <a href="/LoginForm"><button className="logout-btn">LOGOUT</button></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
